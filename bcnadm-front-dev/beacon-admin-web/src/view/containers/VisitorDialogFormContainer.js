import VisitorForm from 'src/view/components/visitors/VisitorForm';
import { VISITOR_DIALOG_FORM } from 'src/consts/FormsNames';
import { validate } from 'src/view/components/visitors/validate';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { withLocalize } from 'react-localize-redux';

const selector = formValueSelector(VISITOR_DIALOG_FORM);

const mapStateToProps = (state, props) => {
  const currentVisitor = props.visitor;
  return {
    initialValues: {
      name: currentVisitor.name,
      deviceId: currentVisitor.deviceId,
      entityId: currentVisitor.entityId
    },
    name: selector(state, 'name'),
    deviceId: selector(state, 'deviceId'),
    currentVisitor
  };
};

export default withRouter(
  withLocalize(
    connect(mapStateToProps)(
      reduxForm({
        form: VISITOR_DIALOG_FORM,
        validate
      })(VisitorForm)
    )
  )
);
