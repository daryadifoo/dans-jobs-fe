import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import JobService from "../services/job.service";
import parse from "html-react-parser";

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      data: null,
      otherJobs: null,
    };
  }

  getPositionsDetail(id) {
    this.setState({
      loading: true,
    });

    JobService.getPositionsDetail(id).then(
      (response) => {
        this.setState({
          data: response.data,
        });
        JobService.getPositions(`description=${response.data.company}`).then(
          (responseOther) => {
            this.setState({
              otherJobs: responseOther.data.length,
            });
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
    const id = window.location.href.split("/")[4];
    this.getPositionsDetail(id);
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div className="container">
        {this.state.userReady ? (
          <div>
            <a href="/">
              <small className="text-primary">
                <b>Back</b>
              </small>
            </a>

            <div className="card m-0 mt-2 mb-5">
              {this.state.data ? (
                <div className="card-body">
                  <p className="mb-0 text-secondary">
                    {this.state.data.type} / <b>{this.state.data.location}</b>
                  </p>
                  <h4 className="mb-1 text-info font-weight-bold">
                    {this.state.data.title}
                  </h4>
                  <hr class="hr" />

                  <div class="container p-0">
                    <div class="row">
                      <div class="col-md-8">
                        {parse(this.state.data.description)}
                      </div>
                      <div class="col-md-4">
                        <div className="card m-0 mt-2 p-0">
                          <div class="card-header p-2 m-0">
                            <b>{this.state.data.company}</b>
                          </div>
                          <a href="/">
                            <small className="m-2 text-info float-right">
                              {this.state.otherJobs ? (
                                <b>{this.state.otherJobs} other jobs</b>
                              ) : (
                                ""
                              )}
                            </small>
                          </a>
                          <img alt="" src={this.state.data.company_logo} />
                          <img alt="" src="/logo192.png" />

                          <a href="/">
                            <small className="m-2 text-info float-left">
                              <b>{this.state.data.company_url}</b>
                            </small>
                          </a>
                        </div>
                        <div className="card m-0 mt-4 p-0">
                          <div class="card-header p-2 m-0">
                            <b>How to apply</b>
                          </div>
                          <div className="p-2">
                            {parse(this.state.data.how_to_apply)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
