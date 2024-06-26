import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/FirebaseConfing';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import axios from 'axios'; // Import axios
import CallApi from './CallApi';
export default function Dangki() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [roleId, setRoleId] = useState(3);
    const [email, setEmail] = useState('');
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;



    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [infoMsg, setInfoMsg] = useState('');

    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState('');
    const [allAccounts, setAllAccounts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allAccountResponse = await CallApi.getAllAccount();
                setAllAccounts(allAccountResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (user) {
            // navigate('/dangki');
        } else {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = localStorage.getItem('emailForSignIn');
                if (!email) {
                    email = window.prompt('Please provide your email');
                }
                setInitialLoading(true);
                signInWithEmailLink(auth, email, window.location.href)
                    .then((result) => {
                        // Send saved form data to server
                        const formData = JSON.parse(localStorage.getItem('formData'));
                        if (formData) {
                            axios.post('http://swprealestatev2-001-site1.etempurl.com/api/account/TaoTaiKhoan', {
                                ...formData,
                                createAt: new Date().toISOString(),
                                status: true
                            }).then(response => {
                                console.log('Data sent successfully', response.data);
                                navigate('/kiemtraemail');
                            }).catch(error => {
                                console.error('Failed to send data', error);
                            });
                        }
                        localStorage.removeItem('emailForSignIn');
                        localStorage.removeItem('formData');
                        setInitialLoading(false);
                        setInitialError('');
                        navigate('/');
                    }).catch((err) => {
                        setInitialLoading(false);
                        setInitialError(err.message);
                        navigate('/login');
                    });
            }
        }
    }, [user, navigate]);
    const handleRoleChange = (e) => {
        setRoleId(parseInt(e.target.value)); // Chuyển giá trị sang số nguyên và cập nhật state
        // console.log('Role ID:', parseInt(e.target.value)); // In giá trị roleId vào console log
    };
    const handleLogin = (e) => {
        if (!roleId) {
            setLoginError('Vui lòng chọn Role ID.');
            return;
        }
    
        e.preventDefault();
        if (!email || !username || !password || !confirmPassword || !phoneNumber || !address) {
            setLoginError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        // Kiểm tra mật khẩu không được chứa khoảng trắng
        if (password.includes(' ')) {
            setLoginError('Mật khẩu không được chứa khoảng trắng.');
            return;
        }
    
        // Kiểm tra mật khẩu phải chứa ít nhất 6 kí tự và có ít nhất 1 kí tự viết hoa
        if (password.length < 6 || !/[A-Z]/.test(password)) {
            setLoginError('Mật khẩu phải chứa ít nhất 6 kí tự và có ít nhất 1 kí tự viết hoa.');
            return;
        }
    
        // Kiểm tra mật khẩu và xác nhận mật khẩu không khớp
        if (password !== confirmPassword) {
            setLoginError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
    
        // Kiểm tra số điện thoại phải có từ 8 đến 11 số
        if (phoneNumber.length < 8 || phoneNumber.length > 11) {
            setLoginError('Số điện thoại phải có từ 8 đến 11 số.');
            return;
        }
    
        // Kiểm tra email edu không được phép
        if (email.endsWith('.edu')) {
            setLoginError('Email edu không được phép.');
            return;
        }
    
        // Kiểm tra email không đúng định dạng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoginError('Email không đúng định dạng.');
            return;
        }
    
        // Nếu các điều kiện kiểm tra đều đã được thỏa mãn, tiếp tục quá trình đăng ký
        const formData = { username, password, phoneNumber, address, roleId, email };
        localStorage.setItem('formData', JSON.stringify(formData));
        localStorage.setItem('emailForSignIn', email);
    
        // Kiểm tra xem email đã tồn tại trong danh sách hay không
        const emailExists = allAccounts.some(account => account.email === email && account.status === true);
    
        if (emailExists) {
            // Nếu email đã tồn tại, hiển thị thông báo lỗi
            setLoginError('Email đã tồn tại trong hệ thống.');
        } else {
            // Nếu email không tồn tại, tiếp tục quá trình đăng ký
            setLoginLoading(true);
            sendSignInLinkToEmail(auth, email, {
                url: 'https://swp301.vercel.app/dangki',
                handleCodeInApp: true,
            }).then(() => {
                setLoginLoading(false);
                setLoginError('');
                setInfoMsg('Chúng tôi đã gửi cho bạn một email với đường link để đăng nhập. Vui lòng kiểm tra email của bạn.');
            }).catch(err => {
                setLoginLoading(false);
                setLoginError(err.message);
            });
        }
    };
    


    return (
        <div className='box'>
            {initialLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {initialError !== '' ? (
                        <div className='error-msg'>{initialError}</div>
                    ) : (
                        <form className='form-group custom-form' onSubmit={handleLogin}>
                            <label>Email</label>
                            <input type={'email'} required placeholder='Enter Email'
                                className='form-control'
                                value={email || ''} onChange={(e) => setEmail(e.target.value)} />

                            <label>Username</label>
                            <input type={'text'} required placeholder='Enter Username'
                                className='form-control'
                                value={username || ''} onChange={(e) => setUsername(e.target.value)} />

                            <label>Password</label>
                            <input type={'password'} required placeholder='Enter Password'
                                className='form-control'
                                value={password || ''} onChange={(e) => setPassword(e.target.value)} />
                            <label>Confirm Password</label>
                            <input type={'password'} required placeholder='Confirm Password'
                                className='form-control'
                                value={confirmPassword || ''} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <label>Phone Number</label>
                            <input type={'tel'} required placeholder='Enter Phone Number'
                                className='form-control'
                                value={phoneNumber || ''} onChange={(e) => setPhoneNumber(e.target.value)} />

                            <label>Address</label>
                            <input type={'text'} required placeholder='Enter Address'
                                className='form-control'
                                value={address || ''} onChange={(e) => setAddress(e.target.value)} />

                            <label>Role ID</label>
                            <div>
                                <label>
                                    <input type="radio" value="3" checked={roleId === 3} onChange={handleRoleChange} />
                                    Khách hàng
                                </label>
                                <label>
                                    <input type="radio" value="2" checked={roleId === 2} onChange={handleRoleChange} />
                                    Nhà đầu tư
                                </label>
                            </div>

                            <button type='submit' className='btn btn-success btn-md'>
                                {loginLoading ? (
                                    <span>Đang đăng ký</span>
                                ) : (
                                    <span>Đănsg ký</span>
                                )}
                            </button>
                            {/* show login error msg */}
                            {loginError !== '' && (
                                <div className='error-msg'>{loginError}</div>
                            )}

                            {/* show info msg */}
                            {infoMsg !== '' && (
                                <div className='info-msg'>{infoMsg}</div>
                            )}
                        </form>
                    )}
                </>
            )}
        </div>
    )

}
