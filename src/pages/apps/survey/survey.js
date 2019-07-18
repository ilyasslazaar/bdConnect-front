import React, { Component, Fragment } from "react";
import IntlMessages from "../../../util/IntlMessages";
import { injectIntl} from 'react-intl';
import MUIDataTable from "mui-datatables";
import {
  Row,
  Card,
  CardBody,
  Badge,
  CardTitle
} from "reactstrap";

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Colxx } from "../../../components/CustomBootstrap";
import { NavLink } from "react-router-dom";
import ApplicationMenu from "../../../components/ApplicationMenu";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import {
  getSurveyList,
  getSurveyListWithFilter,
  getSurveyListWithOrder,
  getSurveyListSearch,
  addSurveyItem,
  selectedSurveyItemsChange
} from "../../../redux/actions";

import ReactQuill from "react-quill";

const options = {
  filterType: 'checkbox',
  responsive: 'scroll'
};
const columns = ["Name", "Company", "City", "State","Name", "Company", "City", "State","Name", "Company", "City", "State"];

const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY","Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT","Joe James", "Test Corp", "Yonkers", "NY"],
 ["Bob Herm", "Test Corp", "Tampa", "FL","Joe James", "Test Corp", "Yonkers", "NY"],
 ["James Houston", "Test Corp", "Dallas", "TX","Joe James", "Test Corp", "Yonkers", "NY"],
];




class SurveyListApplication extends Component {
  constructor(props) {
    super(props);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,


      title: "",
      label: {},
      category: {},
      status: "ACTIVE",
      displayOptionsIsOpen: false
    };
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableSelectCell: {
        root: {
          backgroundColor: "white"
        }
      }
    }
  })

  componentDidMount() {
    this.props.getSurveyList();
  }

  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }
  
  render() {
    
    return (

      <Fragment>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card Style="width:76%">
              <CardBody>
                <CardTitle >
                  <IntlMessages id="SQL" />
                </CardTitle>
                <ReactQuill 
                   theme='bubble' 
                />
              </CardBody>

              <table border="0" Style="border-collapse:separate !important; margin-right:10px; margin-bottom:16px">
                   <tbody>
                   <tr>
                        <td align="right"  Style="padding:18px">
                          <a href="#" title="Execute" target="_blank" Style="font-size: 14px; line-height: 1.5; font-weight: 700; letter-spacing: 1px;padding: 15px 40px; text-align:center; text-decoration:none; color:#FFFFFF; border-radius: 50px; background-color:#922c88;">Execute</a>
                         </td>
                       </tr>
                     </tbody>
               </table>
            </Card>
          </Colxx>
        </Row>
        <Row>
          <Colxx>
          <Card Style="width:76%">
              <MuiThemeProvider theme={this.getMuiTheme()}> 
          <MUIDataTable 
          title={"Employee List"} 
          data={data} 
          columns={columns} 
          options={options}   
      />
      </MuiThemeProvider>
      </Card>
          </Colxx>
        </Row>
        <ApplicationMenu>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="p-4">
          
              <p className="text-muted text-small">
                <IntlMessages id="Queries" />
              </p>
              
            
            </div>
          </PerfectScrollbar>
        </ApplicationMenu>
      </Fragment>
    );
  }
}
const mapStateToProps = ({ surveyListApp }) => {
  return {
    surveyListApp
  };
};
export default injectIntl(connect(
  mapStateToProps,
  {
    getSurveyList,
    getSurveyListWithFilter,
    getSurveyListWithOrder,
    getSurveyListSearch,
    addSurveyItem,
    selectedSurveyItemsChange
  }
)(SurveyListApplication));


