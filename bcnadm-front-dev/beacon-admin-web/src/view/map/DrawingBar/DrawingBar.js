import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Button, IconButton, Snackbar, SnackbarContent, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import './DrawingBar.scss';
import { useHistory } from 'react-router-dom';
import { withLocalize } from 'react-localize-redux';
import { ModeButtonGroup } from 'view/map/ModeButtonGroup';
import { OnMapsDrawingService } from 'service/OnMapsDrawingService';
import { modes } from 'view/map/MapConsts';
import CloseIcon from '@material-ui/icons/Close';

export const googleLayerForOSMap = (
  pictureCoords,
  loadedOSMap,
  buildingImage,
  zoomPosition,
  buildingCenterCoordinates
) => {
  const bounds = L.latLngBounds([pictureCoords[0]]);
  const zoomValue = 18;
  loadedOSMap.current = L.map('map', { zoomControl: false }).setView(buildingCenterCoordinates, zoomValue);
  L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    id: 'main',
    maxZoom: 18,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    zIndex: 3000
  }).addTo(loadedOSMap.current);
  zoomPosition.addTo(loadedOSMap.current);
  L.imageOverlay(buildingImage, pictureCoords).addTo(loadedOSMap.current);
  loadedOSMap.current?.fitBounds(bounds);
};

export const shapesRender = (figures, match, loadedOSMap, translate) => {
  figures.data?.map((figure) => {
    if (figure.levelId === match.params.level) {
      const lay = L.featureGroup().addTo(loadedOSMap?.current);
      const removePolygon = (event) => {
        const element = document.querySelectorAll('.drawing-bar__polygon-button');
        element.forEach((el) =>
          el.addEventListener('click', () => {
            OnMapsDrawingService.deleteShapeFromDataBase(figure.name);
            lay.removeLayer(event.sourceTarget._leaflet_id);
          })
        );
      };
      const showPopUpMessage = () => {
        const element = document.querySelectorAll('.drawing-bar__polygon-button');
        return element.forEach((x) => (x.textContent = translate('drawing.remove')));
      };
      const extractedCoordinates = Object.values(figure.coordinates).map((x) => [x.latitude, x.longitude]);
      const polygon = L.polygon(extractedCoordinates).addTo(lay);
      if (match.params.layer === modes.DRAWING_MODE) {
        polygon.bindPopup(`${'<div class="drawing-bar__polygon-pop-up">'}${figure.name}
          <button type="button" class="drawing-bar__polygon-button"></button></div>`);
      } else {
        polygon.bindPopup(
          match.params.layer === 'monitoring'
            ? `${'<div class="drawing-bar__polygon-pop-up"></div>'}<span class="drawing-bar__polygon-pop-up-name">${
                figure.name
              }</span>
          <button type="button" id="shape-getter" class="drawing-bar__polygon-button_get-data" value='${
            figure.entityId
          }'>${translate('monitoring.getVisitors')}</button>`
            : `${'<div class="drawing-bar__polygon-pop-up"></div>'}<span class="drawing-bar__polygon-pop-up-name">${
                figure.name
              }</span>`
        );
      }
      polygon.on('click', (event) => {
        removePolygon(event);
        showPopUpMessage();
      });
      return polygon;
    }
    return figure;
  });
};

export const zoomPosition = L.control.zoom({
  position: 'bottomright'
});

export const DrawingBar = ({ loadedOSMap, buildingCenterCoordinates, pictureCoords, picture, translate, match }) => {
  const layerWithMap = useRef();
  const [polygons, setPolygons] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const ZOOM_AND_SCALE_VALUES = { zoom: 18, scale: 10 };
  const history = useHistory();
  const [coordinatesToSend, setCoordinatesToSend] = useState([]);
  const [sendingStatus, setSendingStatus] = useState({ error: false, sent: false });

  const sendPolygonsToDataBase = (data) => {
    const element = document.querySelectorAll('.drawing-bar__polygon-send-button');
    element.forEach((el) =>
      el.addEventListener('click', () => {
        OnMapsDrawingService.sendShapesToDataBase(data);
      })
    );
  };

  useEffect(() => {
    const closeButton = document.querySelector('.leaflet-popup-close-button');
    if (sendingStatus.sent === true) {
      closeButton.click();
    }
  }, [sendingStatus.sent]);

  useEffect(() => {
    if (loadedOSMap?.current) {
      layerWithMap.current = loadedOSMap.current;
    }
  }, [loadedOSMap, buildingCenterCoordinates, pictureCoords, picture]);
  const takenCoordinates = [];
  const [name, setName] = useState({ name: '', state: false, savedName: '' });
  const [dataForLocalStorage, setDataForLocalStorage] = useState([]);

  let map = layerWithMap.current;

  const onMapClick = () => {
    if (!map) {
      map = L.map('map', { zoomControl: false }).setView(buildingCenterCoordinates, ZOOM_AND_SCALE_VALUES.zoom);
    }
    if (!zoomPosition) {
      zoomPosition.addTo(map);
    }

    const layers = [];
    const coords = [];

    const activePolyline = L.featureGroup().addTo(map);
    const passivePolyline = L.featureGroup().addTo(map);
    map?.on('click', (evt) => {
      const coordinate = { latitude: evt.latlng.lat, longitude: evt.latlng.lng };
      takenCoordinates.push(coordinate);
      const mainLayer = L.featureGroup().addTo(map);
      const marker = L.marker([evt.latlng.lat, evt.latlng.lng]).addTo(activePolyline).addTo(passivePolyline);
      coords.push([evt.latlng.lat, evt.latlng.lng]);
      layers.push(marker);

      const polyline = L.polyline(coords).addTo(activePolyline);
      marker.on('click', () => {
        const deletePolygon = (event) => {
          const element = document.querySelectorAll('.drawing-bar__polygon-button');
          element.forEach((el) =>
            el.addEventListener('click', () => {
              mainLayer.removeLayer(event.sourceTarget._leaflet_id);
            })
          );
        };

        const popUpContent = `${'<div class="drawing-bar__polygon-name"></div>'}${name.savedName}
          <button type="button" class="drawing-bar__polygon-button">${translate('drawing.remove')}</button>
          <button type="button" class="drawing-bar__polygon-send-button">${translate('drawing.send')}</button>
        `;
        const polygon = L.polygon(coords).addTo(mainLayer);
        if (polygon) {
          setPolygons([...polygons, polygon]);
          map?.off('click');
          passivePolyline.clearLayers(layers);
          activePolyline.clearLayers(layers);
          setCoordinatesToSend([...coordinatesToSend, { takenCoordinates, name: name.savedName }]);
          setDataForLocalStorage([
            ...dataForLocalStorage,
            { coordinates: takenCoordinates, name: name.savedName, levelId: match.params.level }
          ]);
          setDrawing(false);
          setSendingStatus(sendingStatus);
        }
        polygon.bindPopup(popUpContent).openPopup();

        const dataToSend = {
          coordinates: takenCoordinates,
          name: name.savedName,
          levelId: match.params.level,
          status: sendingStatus,
          errorHandler: setSendingStatus
        };

        document.querySelectorAll('.drawing-bar__polygon-button').forEach((button) =>
          button.addEventListener('click', () => {
            mainLayer.removeLayer(polygon._leaflet_id);
          })
        );
        document.querySelectorAll('.drawing-bar__polygon-send-button').forEach((button) =>
          button.addEventListener('click', () => {
            OnMapsDrawingService.sendShapesToDataBase(dataToSend);
          })
        );
        polygon.on('click', (event) => {
          deletePolygon(event);
          sendPolygonsToDataBase(dataToSend);
        });
      });
      setName({ ...name, savedName: '', state: false });
      marker.on('contextmenu', () => {
        if (marker === layers.at(-1)) {
          layers.pop();
          activePolyline.removeLayer(marker);
          coords.pop();
          map?.removeLayer(polyline);
        }
      });
    });
  };

  const onNameSubmit = () => {
    setName({
      ...name,
      savedName: name.name,
      state: true,
      name: ''
    });
    setDrawing(true);
  };

  useEffect(() => {
    if (drawing === true) {
      onMapClick();
    }
  }, [drawing]);

  return (
    <div className="drawing-bar__main-body">
      <div className="drawing-bar__wrapper">
        <ModeButtonGroup
          match={match}
          translate={translate}
          history={history}
          scaleDistance={ZOOM_AND_SCALE_VALUES.scale}
        />
      </div>
      {sendingStatus.error === true && (
        <Snackbar
          open
          autoHideDuration={5000}
          className="drawing-bar-button-group__error-bar"
          onClose={() => setSendingStatus({ ...sendingStatus, error: false })}
        >
          <SnackbarContent
            className="drawing-bar-button-group__error-bar-content"
            message={translate('drawing.existingNameError')}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSendingStatus({ ...sendingStatus, error: false })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>
      )}
      {sendingStatus.sent === true && (
        <Snackbar
          open
          autoHideDuration={5000}
          className="drawing-bar-button-group__error-bar"
          onClose={() => setSendingStatus({ ...sendingStatus, sent: false })}
        >
          <SnackbarContent
            className="drawing-bar-button-group__error-bar-content"
            message={translate('drawing.successfulSending')}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSendingStatus({ ...sendingStatus, sent: false })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>
      )}
      {!name.savedName.length && name.state === false && (
        <div className="drawing-bar__name-input-bar">
          <TextField
            disabled={drawing}
            placeholder={translate('drawing.nameTyping')}
            className="drawing-bar__name-input-bar_input"
            value={name.name}
            type="text"
            onChange={(event) => setName({ ...name, name: event.target.value })}
            onKeyPress={(event) => event.key === 'Enter' && onNameSubmit()}
          />
          <Button
            className="drawing-bar__name-input-bar_button"
            color="primary"
            variant="contained"
            type="button"
            disabled={name.name.length === 0}
            onClick={() => {
              onNameSubmit();
            }}
          >
            {translate('drawing.nameConfirmation')}
          </Button>
        </div>
      )}
    </div>
  );
};

DrawingBar.propTypes = {
  picture: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Array)]),
  loadedOSMap: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.instanceOf(Array).isRequired]),
  buildingCenterCoordinates: PropTypes.instanceOf(Array),
  pictureCoords: PropTypes.instanceOf(Array),
  translate: PropTypes.func,
  match: PropTypes.object
};

export default withLocalize(DrawingBar);
