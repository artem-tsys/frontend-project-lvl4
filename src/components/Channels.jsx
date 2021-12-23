import React, {useContext, useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannelId } from '../slices';
import { getModal } from './modal/index';
import { serviceContext } from '../contexts';
import { useTranslation } from 'react-i18next';


const CreateDropdown = ({ item, showModal }) => {
  const { t } = useTranslation();
  return <Dropdown className="channel__dropdown">
    <Dropdown.Toggle as="button" split className="dropdown__open dropdown-toggle" id="dropdown-channel" />
    <Dropdown.Menu>
      <Dropdown.Item as="button" onClick={() => showModal('removing', item)}>{ t('buttons.remove') }</Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => showModal('renaming', item)}>{ t('buttons.rename') }</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
};

const renderModal = ({ modalInfo, hideModal, setChannel}) => {
  if (!modalInfo.type) return null;

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} hideModal={hideModal} setChannel={setChannel} />;
};

const renderChannel = (channel, handlerChangeChannel, showModal) => {
  const dropdown = channel.removable && <CreateDropdown showModal={showModal} item={channel} />;
  return <li className='channel' key={channel.id}>
    <button className="btn channel__link text-start text-truncate" onClick={handlerChangeChannel(channel.id)}> # {channel.name ?? ''}</button>
    {dropdown || null}
  </li>
};

const Channels = () => {
  const { t } = useTranslation();
  const { createChannelService, renameChannelService, removeChannelService } = useContext(serviceContext);
  const { entities, ids } = useSelector(state => state.channels);
  const dispatch = useDispatch();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  const handlerChangeChannel = (channel) => (event) => {
    event.preventDefault();
    dispatch(setCurrentChannelId(channel));
  };

  const mappingChannel = {
    adding: createChannelService,
    renaming: renameChannelService,
    removing: removeChannelService,
  };

  const setChannel = ({type, item}) => {
    mappingChannel[type] && mappingChannel[type](item);
  };

  const channelsList = ids.length
    ? ids.map(id => renderChannel(entities[id], handlerChangeChannel, showModal))
    : '';

  return <div className='sidebar'>
    <div className='sidebar__head'>
      <div className='sidebar__title'>{t('channels.title')}</div>
      <button className='sidebar__btn text-primary' onClick={() => showModal('adding')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             className="bi bi-plus-square" viewBox="0 0 16 16">
          <path
            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </div>
    <div className='sidebar__body'>
      <ul className='channels'>
        {channelsList}
      </ul>
    </div>
    {renderModal({ modalInfo, hideModal, setChannel })}
  </div>;
};

export default Channels;