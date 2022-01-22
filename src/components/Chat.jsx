import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import routes from '../routes';
import { setAll, removeAll } from '../store/channel-slice.js';
import Channels from './Channels';
import Messages from './Messages';

import useAuth from '../hooks';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  useEffect(async () => {
    try {
      const { data } = await axios.get(routes.channelsPath(), auth.getHeader(auth));
      dispatch(setAll(data));
    } catch (err) {
      if (err.isAxiosError && err.response.status === 401) {
        auth.logOut();
        navigate('/');
      }
      const keyErrorText = err.isAxiosError ? t('errors.network') : err.message;
      toast.error(keyErrorText, {
        progressClassName: 'error',
        pauseOnHover: false,
      });
    }
  }, []);

  useEffect(() => () => {
    dispatch(removeAll());
  }, []);

  return (
    <div className="my-container d-flex col-8 mx-auto">
      <Channels />
      <Messages />
    </div>
  );
};

export default Chat;
