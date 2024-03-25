import React, { useEffect, useState } from 'react';
import InvestorMenu from './investor-menu';
import CallApi from '../CallApi';
import UserInvestor from '../../list/userInvestor';
import Card from 'react-bootstrap/Card';

export default function Investorthongtintaikhoan() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const userid = userLoginBasicInformationDto.accountId;
    const [userAccount, setUserAccount] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const callDataAllAccount = await CallApi.getAllAccount();

                // Tìm tài khoản của user
                const userAccountData = callDataAllAccount.find(account => account.id === userid);

                setUserAccount(userAccountData);
            } catch (error) {
                console.error('Error fetching payments:', error.message);
            }
        };

        fetchData();
    }, [userid]);

    return (
        <div className='container'>
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}
            />

            <div className="col-md-12" style={{paddingTop: '114px'}}>
                {userAccount && (
                    // <div>
                    //     <h2>Thông tin thẻ của bạn:</h2>
                    //     <p><b>ID Thẻ:</b> {userAccount.id}</p>
                    //     <p><b>Tên Chủ Thẻ: </b> {userAccount.username}</p>
                    //     <p><b>Số điện thoại:</b> {userAccount.phoneNumber}</p>
                    //     <p><b>Email: </b> {userAccount.email}</p>
                    //     <p><b>Địa chỉ: </b> {userAccount.address}</p>
                    // </div>
                    <Card border="success" style={{ width: '500px' }}>
                    <Card.Header>Thông tin thẻ của bạn</Card.Header>
                    <Card.Body>
                      <Card.Title style={{fontSize: '18px'}}> <b>Tên chủ thẻ: </b> {userAccount.username} </Card.Title>
                      <Card.Title style={{fontSize: '18px'}}> <b>Số điện thoại: </b> {userAccount.phoneNumber} </Card.Title>
                      <Card.Title style={{fontSize: '18px'}}> <b>Email: </b> {userAccount.email} </Card.Title>
                      <Card.Title style={{fontSize: '18px'}}> <b>Địa chỉ: </b> {userAccount.address} </Card.Title>
                      <Card.Text>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )}
            </div>
        </div>
    )
}
