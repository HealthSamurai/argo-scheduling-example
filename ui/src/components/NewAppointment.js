import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import moment from 'moment';

import { Form, DatePicker, Select, Button, Table } from 'antd';

import Spinner from './Spinner';

const visitTypes = [
  { code: 'breast-imaging', display: 'BREAST IMAGING' },
  { code: 'consult', display: 'CONSULTATION' },
  { code: 'ct', display: 'COMPUTED TOMOGRAPHY SCAN(CT)' },
  { code: 'dental', display: 'DENTAL' },
  { code: 'dxa', display: 'DUAL-ENERGY X-RAY ABSORPTIOMETRY(DXA)' },
  { code: 'echo', display: 'ECHOCARDIOGRAPHY(ECHO)' },
  { code: 'echo-stresstest', display: 'ECHOCARDIOGRAPHY(ECHO) STRESS TEST' },
  { code: 'ed-followup', display: 'EDUCATION FOLLOW UP' },
  { code: 'eeg', display: 'ELECTROENCEPHALOGRAPHY(EEG)' },
  { code: 'egd', display: 'ESOPHAGOGASTRODUODENOSCOPY(EGD)' },
  { code: 'ekg', display: 'ELECTROCARDIOGRAM(EKG)' },
  { code: 'evaluation', display: 'EVALUATION' },
  { code: 'flu-shot-clinic', display: 'INFLUENZA VACCINATION CLINIC' },
  { code: 'fluoroscopy', display: 'FLUOROSCOPY' },
  { code: 'follow-up', display: 'FOLLOW UP' },
  { code: 'home-health', display: 'HOME HEALTH VISIT' },
  { code: 'injection', display: 'INJECTION' },
  { code: 'inter-rad', display: 'INTERVENTIONAL RADIOLOGY' },
  { code: 'lab', display: 'LABORATORY TESTS' },
  { code: 'minor-surgery', display: 'MINOR SURGERY' },
  { code: 'mri', display: 'MAGNETIC RESONANCE IMAGING(MRI)' },
  { code: 'new-patient', display: 'NEW PATIENT' },
  { code: 'nuc-med', display: 'NUCLEAR MEDICINE' },
  { code: 'occup-therapy', display: 'OCCUPATIONAL THERAPY' },
  { code: 'office-visit', display: 'OFFICE VISIT' },
  { code: 'physical', display: 'PHYSICAL' },
  { code: 'post-op', display: 'POST-OPERATIVE(POST-OP)' },
  { code: 'pre-admit-testing', display: 'PRE-ADMISSION TESTING VISIT' },
  { code: 'pre-op', display: 'PRE-OPERATIVE(PRE-OP)' },
  { code: 'procedure', display: 'PROCEDURE' },
  { code: 'same-day', display: 'SAME DAY' },
  { code: 'stress-test', display: 'STRESS TEST' },
  { code: 'surgery', display: 'SURGERY' },
  { code: 'treatment', display: 'TREATMENT' },
  { code: 'ultrasound', display: 'ULTRASOUND' },
  { code: 'urgent', display: 'URGENT' },
  { code: 'vaccine', display: 'VACCINATION' },
  { code: 'vision', display: 'VISION' },
  { code: 'walk-in', display: 'WALK IN' },
  { code: 'well-child', display: 'WELL CHILD' },
  { code: 'x-ray', display: 'X-RAY' }
];

const formLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 }
  }
};

class CreateAppointmentFormPure extends React.Component {
  handleSubmit = () => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields((err, fieldValues) => {
        if (!err) {
          return resolve(fieldValues);
        }
        return reject(err);
      });
    });
  };

  hasError = field => {
    const { getFieldError } = this.props.form;
    return getFieldError(field);
  };

  render() {
    const {
      form: { getFieldDecorator },
      specialty
    } = this.props;
    return (
      <Form>
        <Form.Item
          {...formLayout}
          validateStatus={this.hasError('date') ? 'error' : ''}
          label="Select date"
        >
          {getFieldDecorator('date', {
            rules: [{ required: true, message: 'Please select date' }]
          })(<DatePicker.RangePicker size="default" />)}
        </Form.Item>
        <Form.Item
          {...formLayout}
          validateStatus={this.hasError('specialty') ? 'error' : ''}
          label="Select specialty"
        >
          {getFieldDecorator('specialty', {
            rules: [{ required: true, message: 'Please select specialty' }]
          })(
            <Select>
              {specialty.map((v, i) => (
                <Select.Option key={`${i}`} value={v.id}>
                  {v.specialty[0].coding[0].display}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formLayout}
          validateStatus={this.hasError('specialty') ? 'error' : ''}
          label="Visit type"
        >
          {getFieldDecorator('visit-type', {
            rules: [{ required: true, message: 'Please select visit type' }]
          })(
            <Select>
              {visitTypes.map((v, i) => (
                <Select.Option key={`${i}`} value={v.code}>
                  {v.display}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    );
  }
}

const CreateAppointmentForm = Form.create({ name: 'new_appointment' })(
  CreateAppointmentFormPure
);

let form = null;

export default () => {
  const { dispatch, create } = useStoreon('create');
  const [hide, setHide] = useState(false);
  const { loading, specialtyList, error, list } = create;
  const columns = [
    {
      title: 'Date',
      dataIndex: 'start',
      key: 'start',
      render: (start, r) => (
        <span>
          {moment(start).format('LLL')} - {moment(r.end).format('LLL')}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (t, r) =>
        r.status === 'booked' ? (
          'Booked'
        ) : (
          <Button onClick={() => dispatch('appointment/$hold', r)}>
            Register
          </Button>
        )
    }
  ];

  useEffect(() => {
    dispatch('appointment/get-specialty');
  }, [dispatch]);

  const _handleSubmit = async () => {
    try {
      const values = await form.handleSubmit();
      dispatch('appointment/$find', {
        start: values.date[0].format('YYYY-MM-DD'),
        end: values.date[1].format('YYYY-MM-DD'),
        specialty: values.specialty,
        'visit-type': values['visit-type']
      });
      setHide(true);
    } catch (err) {
      console.log('form errors:', err);
    }
  };

  return (
    <div>
      <h2>Create new appointment</h2>
      {loading && !list && <Spinner />}
      {!loading && error && <div>{error}</div>}
      <div style={{ width: '700px', margin: '20px auto' }}>
        <h3>
          Search slots
          {(hide || (list && list.length > 0)) && (
            <Button style={{ marginLeft: 15 }} onClick={() => setHide(!hide)}>
              {hide ? 'Show' : 'Hide'} search
            </Button>
          )}
        </h3>
        <div className={hide ? 'hidden' : ''}>
          {(!hide || !loading || specialtyList.length > 0) &&
            !error && [
              <CreateAppointmentForm
                key="1"
                specialty={specialtyList}
                wrappedComponentRef={f => (form = f)}
              />,
              <div key="2" style={{ textAlign: 'center' }}>
                <Button
                  onClick={_handleSubmit}
                  disabled={loading}
                  type="primary"
                >
                  Search
                </Button>
              </div>
            ]}
        </div>
      </div>
      {list && list.length > 0 && (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      )}
    </div>
  );
};
