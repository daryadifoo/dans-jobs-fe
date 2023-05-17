import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Navigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import JobService from "../services/job.service";
const moment = require("moment");

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNextSearch = this.handleNextSearch.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeFullTime = this.onChangeFullTime.bind(this);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      loading: false,
      description: "",
      location: "",
      fullTime: false,
      data: [],
      page: 1,
      lastPage: false,
    };
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }
  onChangeLocation(e) {
    this.setState({
      location: e.target.value,
    });
  }
  onChangeFullTime(e) {
    this.setState({
      fullTime: e.target.checked,
    });
  }

  getPositions(page) {
    this.setState({
      loading: true,
    });
    let params = `page=${page}`;
    if (this.state.description) {
      params = params + `&description=${this.state.description}`;
    }
    if (this.state.location) {
      params = params + `&location=${this.state.location}`;
    }

    if (this.state.fullTime === true) {
      params = params + `&full_time=true`;
    }

    JobService.getPositions(params).then(
      (response) => {
        if (page === 1) {
          this.setState({
            data: response.data,
            loading: false,
          });
        } else {
          this.setState({
            data: [...this.state.data, ...response.data],
            loading: false,
          });
        }

        this.setState({
          lastPage: response.data.length < 8 ? true : false,
        });
      },
      (error) => {
        this.setState({
          loading: false,
        });
      }
    );
  }

  handleSearch(e) {
    e.preventDefault();
    this.getPositions(1);
    this.setState({
      page: 1,
    });
  }

  handleNextSearch() {
    this.setState({
      loading: true,
    });
    const newPage = parseInt(this.state.page) + 1;
    console.log(newPage);
    this.getPositions(newPage);
    this.setState({
      page: newPage,
    });
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true });
    this.getPositions(this.state.page);
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div className="container">
        {this.state.userReady ? (
          <div>
            <Form
              onSubmit={this.handleSearch}
              ref={(c) => {
                this.form = c;
              }}
            >
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>Jobs Description</label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Filter by title, benefit, companies, expertise"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label>Location</label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Filter by city, state, zip code or country"
                    value={this.state.location}
                    onChange={this.onChangeLocation}
                  />
                </div>
                <div className="form-group col-md-2 align-self-end pb-2">
                  <div className="form-check">
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      checked={this.state.fullTime}
                      onChange={this.onChangeFullTime}
                    />
                    <label className="form-check-label">
                      <b>Full Time Only</b>
                    </label>
                  </div>
                </div>
                <div className="form-group col-md-2 align-self-end">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={this.state.loading}
                  >
                    {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </Form>

            <div className="list-group mt-3 mb-5">
              <h3>Job List</h3>
              <div className="card p-0 m-0 border-top-0 border-bottom-0">
                {this.state.data && this.state.data.length > 0
                  ? this.state.data.map((object, i) => (
                      <Link
                        to={"/details/" + object.id}
                        key={i}
                        className="list-group-item list-group-item-action flex-column align-items-start py-3 border-right-0 border-left-0"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1 text-info font-weight-bold">
                            {object.title}
                          </h5>
                          <small className="text-secondary">
                            <b>{object.location}</b>
                          </small>
                        </div>
                        <div className="d-flex w-100 justify-content-between">
                          <p className="mb-1">
                            {object.company} - <b>{object.type}</b>
                          </p>
                          <small className="text-muted">
                            {moment(object.created_at).fromNow(true)} ago
                          </small>
                        </div>
                      </Link>
                    ))
                  : ""}
              </div>
            </div>

            {this.state.data &&
            this.state.data.length > 0 &&
            !this.state.lastPage ? (
              <div className="text-center mb-5">
                <button
                  className="btn btn-primary btn-block"
                  disabled={this.state.loading}
                  onClick={this.handleNextSearch}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>More jobs</span>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
