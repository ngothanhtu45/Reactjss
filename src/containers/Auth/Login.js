import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginAPI } from '../../services/userService';
import { userLoginSuccess } from '../../store/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errorMessage: false,
        }
    }

    handleOnchangeUserName = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    handleOnchangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    handleLogin = async () => {
        this.setState({
            errorMessage: ''
        })
        try {
            let data = await handleLoginAPI(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errorMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('success');
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errorMessage: e.response.data.message
                    })
                }
            }
        }

    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {

        return (
            <div className='login-backgroud'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 from-group login-input'>
                            <label>UserName:</label>
                            <input
                                value={this.state.username}
                                onChange={(e) => this.handleOnchangeUserName(e)}
                                type='text' className='form-control' placeholder='Enter your username' />
                        </div>
                        <div className='col-12 from-group login-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input
                                    onChange={(e) => this.handleOnchangePassword(e)}
                                    value={this.state.password}
                                    type={this.state.isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Enter ypur password' />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i class={this.state.isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errorMessage}
                        </div>
                        <div className='col-12'>
                            <button
                                onClick={() => this.handleLogin()}
                                className='btn-login'>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password?</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login '>Or Login with:</span>
                        </div>
                        <div className='col-12 social-login '>
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
