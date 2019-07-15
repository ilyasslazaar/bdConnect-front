import React, { Component, Fragment } from "react";
import IntlMessages from "util/IntlMessages";
import { Row } from "reactstrap";
import { connect } from "react-redux";
import Tree from "react-animated-tree";

import { Colxx, Separator } from "components/CustomBootstrap";
import { getMissingsPages } from "redux/actions";

const config = open => ({
  from: { height: 0, opacity: 0, transform: "none" },
  to: {
    height: open ? "auto" : 0,
    opacity: open ? 1 : 0,
    transform: "none"
  }
});

const SpecialTree = props => <Tree {...props} springConfig={config} />;

class MissingBoxCmp extends Component {
  constructor(props) {
    super(props);
    const { boxMetadata = {} } = this.props;
    if (boxMetadata.project) {
      props.getMissingsPages(boxMetadata.project, boxMetadata.number);
    } else {
      this.props.history.push("/app/documents/list");
    }
  }
  render() {
    const { missingsPages } = this.props;
    const missingDocuments = missingsPages.data.missingDocuments || [];

    return (
      <Row>
        <Colxx xxs="12">
          <h1>
            <IntlMessages id="Missings Pages" />
          </h1>
          <Separator className="mb-5" />
        </Colxx>
        {missingsPages.loading ? (
          <div className="loading" />
        ) : (
          <Fragment>
            {missingDocuments.map((item, key) => (
              <Colxx xxs="12" md="4" key={key}>
                <SpecialTree
                  content={item.documentName.docName}
                  canHide
                  open
                  onClick={() => {
                    this.props.history.push("/app/documents/importDoc");
                  }}
                >
                  {item.missingPages.map((page, key) => (
                    <SpecialTree
                      content={page.pageName}
                      canHide
                      key={key}
                      onClick={() => {
                        this.props.history.push("/app/documents/importDoc");
                      }}
                    />
                  ))}
                </SpecialTree>
              </Colxx>
            ))}
          </Fragment>
        )}
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { appData } = state;
  return {
    missingsPages: appData.boxs.missingsPages,
    boxMetadata: appData.boxs.metadata
  };
};

export const MissingBox = connect(
  mapStateToProps,
  { getMissingsPages }
)(MissingBoxCmp);
