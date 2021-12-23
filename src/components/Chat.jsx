import React, {useEffect} from 'react';
import axios from 'axios';
import routes from '../routes';
import { setAll, removeAll } from '../slices';
import Channels from './Channels';
import Messages from './Messages';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {useTranslation} from 'react-i18next';

const getHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return {
      headers: {
        Authorization: `Bearer ${userId.token}`,
      }
    }
  }
  return {};
};

const Chat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(async () => {
    try {
      const { data } = await axios.get(routes.channelsPath(), getHeader());
      dispatch(setAll(data));
    } catch (e) {
      const keyErrorText = e.isAxiosError ? t('toast.failed request'): e.message;
      toast.error(keyErrorText, {
        progressClassName: 'error',
        pauseOnHover: false
      });
    }

  }, []);

  useEffect(() => {
    return () => {
      dispatch(removeAll());
    }
  });

  return <div className='my-container d-flex col-8 mx-auto'>
    <Channels />
    <Messages />
    <ToastContainer draggable={false}/>
  </div>;
};

export default Chat;