async function userSub(ctx, msg) {
  const {
    event: { action, resource }
  } = msg;

  if (action === 'create' && (!resource.data ||
			      (!resource.data.admin &&
			       !resource.data.practitioner_id))) {
    try {
      if (
	!resource.name.familyName &&
	  !resource.name.givenName &&
	  resource.name.formatted
      ) {
	const [givenName, familyName] = resource.name.formatted.split(' ');
	resource.name.familyName = familyName;
	resource.name.givenName = givenName;
      }
      const patientRes = {
	resourceType: 'Patient',
	name: [
	  {
	    family: resource.name.familyName,
	    given: [resource.name.givenName]
	  }
	],
	telecom: [{ value: resource.email, use: 'home', system: 'email' }]
      };

      const patients = await ctx.request({
	url: '/fhir/Patient/$match',
	method: 'post',
	body: {
	  resourceType: 'Parameters',
	  parameter: [
	    {
	      name: 'resource',
	      resource: patientRes
	    }
	  ]
	}
      });

      let patient_id = null;

      if (patients.total > 0) {
	patient_id = patients.entry[0].resource.id;
      } else {
	const patientReq = await ctx.request({
	  url: '/fhir/Patient',
	  method: 'post',
	  body: patientRes
	});

	console.log("Created new patient resource", patientRes)

	patient_id = patientReq.id;
      }

      if (patient_id) {
	console.log("Linking user ", resource.id, "to patient", patient_id);

	if (!resource.data) {
	  resource.data = {};
	}

	resource.data.patient_id = patient_id;

	await ctx.request({
	  url: `/fhir/User/${resource.id}`,
	  method: 'put',
	  body: resource
	});

	console.log("Updated user resource", resource)
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  userSub
};
