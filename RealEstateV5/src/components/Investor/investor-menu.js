import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../CallApi';
import { menuItemClasses } from '@mui/base';
import { NavLink } from 'react-router-dom';

export default function InvestorMenu({ userLoginBasicInformationDto, UserMenu }) {
    const [invesBalances, setInvesBalances] = useState(() => {
        const storedBalance = localStorage.getItem('invesBalances');
        return storedBalance ? JSON.parse(storedBalance) : [];
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllWallet = await CallApi.getAllWallet();
                const getIdInvestorWallet = getAllWallet.find(IdInvestor => IdInvestor.investorId === parseInt(userLoginBasicInformationDto.accountId));
                const accountBalances = getIdInvestorWallet.accountBalance;
    
                // Kiểm tra xem số dư hiện tại có khác với số dư trong cơ sở dữ liệu không
                if (JSON.stringify(accountBalances) !== JSON.stringify(invesBalances)) {
                    setInvesBalances(accountBalances);
                    localStorage.setItem('invesBalances', JSON.stringify(accountBalances));
                }
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, [userLoginBasicInformationDto.accountId, invesBalances]);

    // Function to remove 'invesBalances' from localStorage
    const removeInvesBalancesFromLocalStorage = () => {
        localStorage.removeItem('invesBalances');
    };

    const [startAnimate, setStartAnimate] = React.useState(false);
    const [highlightTopPosition, setStateHighlightTopPosition] = React.useState(0);
    const [currCount, setCurrCount] = React.useState(0);
    const onClickTab = (count) => {
        setStartAnimate(false);
        setCurrCount(count);
        setStateHighlightTopPosition(count * 68);

        setTimeout(() => {
            setStartAnimate(true);
        }, 100);
    }
    React.useEffect(() => {

        setTimeout(() => {
            setStartAnimate(true);
        }, 500);

        return () => {

        }
    })
    return (
        <div className="container">
            <div className="sidebar">
                <div className='info-nav'>
                    <div className='info-nav1'>
                        <span className='welcome'>Xin chào, {userLoginBasicInformationDto.username}!</span>
                        <div className="balance">Số dư: <span style={{ fontWeight: 'bold' }}>{invesBalances.length > 0 ? invesBalances : 0} VND</span>
                        </div>
                    </div>
                </div>
                {/* <ul className="menu-list">
                    {UserMenu.map(menuItem => (
                        <li key={menuItem.id} className="menu-item">
                            <Link to={menuItem.link}>{menuItem.name}</Link>
                        </li>
                    ))}
                </ul> */}
                
                {/* <div style={{ top: `${highlightTopPosition}px` }} className={`sidebar__highlight ${startAnimate && 'sidebar__highlight__animate'}`}></div> */}
                <div className='overflow-container'>
                {UserMenu.map(menuItem => (
                    // <a key={menuItem.id} className={currCount ===  menuItem.id && 'active'} href={menuItem.link} onClick={() => onClickTab(menuItem.id)}>
                    //     <span style={{fontSize: '17px'}} className={currCount === menuItem.id  && 'text-active'}><i key={menuItem.id}></i> {menuItem.name}</span>
                    // </a>
                    <NavLink exact activeClassName="active" className={currCount ===  menuItem.id && 'active'} to={menuItem.link}>{menuItem.name}</NavLink>

                ))}
                </div> 
                {/* <a className={currCount === 0 && 'active'} href="#home" onClick={() => onClickTab(0)}>
                    <span className={currCount === 0 && 'text-active'}><i key={menuItem.id} class="fas fa-arrow-right"></i></span>
                </a>
                <a className={currCount === 1 && 'active'} href="#news" onClick={() => onClickTab(1)}>
                    <span className={currCount === 1 && 'text-active'}><i class="fas fa-arrow-right"></i> News</span>
                </a>
                <a className={currCount === 2 && 'active'} href="#contact" onClick={() => onClickTab(2)}>
                    <span className={currCount === 2 && 'text-active'}><i class="fas fa-arrow-right"></i> Contact</span>
                </a>
                <a className={currCount === 3 && 'active'} href="#about" onClick={() => onClickTab(3)}>
                    <span className={currCount === 3 && 'text-active'}><i class="fas fa-arrow-right"></i> About</span>
                </a> */}

                <button onClick={removeInvesBalancesFromLocalStorage}>Xóa dữ liệu</button>
            </div>
        </div>
    );
}
