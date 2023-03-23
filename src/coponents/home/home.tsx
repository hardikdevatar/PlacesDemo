import { AutoComplete, Typography, Divider, Layout } from 'antd';

import React, { useEffect, useState } from 'react';
import { withGoogleMap, GoogleMap, Marker, OverlayView } from "react-google-maps"
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchPlaces } from '../../redux/reducers/home';
import './home.css';


interface mapProps {
  selectedPlace: any
}

const { Title } = Typography;


const Home: React.FC = () => {
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [anotherOptions, setAnotherOptions] = useState<{ value: any, item: any }[]>([]);
  const [selectedPlaceItem, setSelectedPlaceItem] = useState<any>({
    item: {
      properties: {
        lat: 25.03,
        lon: 121.6
      }
    }
  });
  const dispatch = useAppDispatch();
  const places = useAppSelector((state: any) => {
    console.log('=====state', state);
    return state.places?.value?.features?.map((item: any) => {
      return { value: item.properties.place_id, label: item.properties.name, item };
    });
  });

  console.log('=====Places', places);
  const getPanelValue = (searchText: string) => !searchText ? [] : places;

  const onSelect = (data: string, item: any) => {
    console.log('onSelect', item);
    setValue(item.label);
    setSelectedPlaceItem(item);
  };

  const onChange = (data: string, item: any) => {
    setValue(data);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      dispatch(fetchPlaces(data));
    }, 500)

    setTimer(newTimer);

  };

  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
  })

  const MapWithAMarker = withGoogleMap((props: mapProps) =>
    <>
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: props.selectedPlace.item?.properties?.lat, lng: props.selectedPlace.item?.properties?.lon }}
      />
      <Marker
        position={{ lat: props.selectedPlace.item?.properties?.lat, lng: props.selectedPlace.item?.properties?.lon }}
      />

    </>)
    ;



  return (
    <Layout className='main-container'>
      <Title level={2}>Places AutoComplete Demo</Title>
      <Divider />
      <AutoComplete
        value={value}
        options={anotherOptions}
        onSelect={onSelect}
        onSearch={(text) => setAnotherOptions(getPanelValue(text))}
        onChange={onChange}
        placeholder="Search here"
        allowClear={true}
      />
      <Divider />
      <MapWithAMarker
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...{ selectedPlace: selectedPlaceItem }}
      />
    </Layout>
  );
};

export default Home;
