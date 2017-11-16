import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DataActions from '../actions/data';
import Home from '../components/Home';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DataActions, dispatch);
}

function mapStateToProps(state) {
  return state.data;
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
