import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';


export default function Agencymenu({ userLoginBasicInformationDto, UserMenu, handleLogout }) {
    const navigate = useNavigate();

    if (!userLoginBasicInformationDto) {
        navigate('/trangchu');
        return null;
    }

    return (
        <div className="admin-menu">
            {/* <span className="admin-menu__welcome">Chào mừng, {userLoginBasicInformationDto.username}!</span> */}
            <a href='/admin-trangchu'>
                <img src={require('./logofooter.png')} alt="" /> {/* xếp lại ảnh vào trong folder img bên src code chính */}
            </a>
            <hr></hr>
            <ul className="admin-menu__list">
                {UserMenu.map(menuItem => (
                    <li key={menuItem.id} className="admin-menu__item">
                        <NavLink
                            to={menuItem.link}
                            className={({ isActive }) => isActive ? "admin-menu__link admin-menu__link--active" : "admin-menu__link"}
                        >
                            {menuItem.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <hr></hr>
            <ul className="admin-menu__list">
                <a style={{textDecoration: 'underline', color:'white', marginLeft: '41px',}} href='/logout'>Đăng Xuất</a>
            </ul>
        </div>
    );
}
