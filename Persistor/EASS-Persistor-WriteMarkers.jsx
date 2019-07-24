/**********************************************************************************************\
*                             Edmund's Audio Synchronization Suite
*                          Programmed by Héctor Colás Valtueña @2019
*                                    Marker writer methods                                     
\**********************************************************************************************/

//@include "../EASS-Namespace.jsx"

//@include "./EASS-Persistor-WriteObjectArrayToPropertyKeyframes.jsx"
//@include "./EASS-Persistor-KeyframeObjectToMarkerValue.jsx"
//@include "./EASS-Persistor-GetActiveComposition.jsx"

/** @function writeObjectArrayToLayerMarkers
 *  Writes an array of keyframe objects as markers to a layer's markers property.
 *
 *  @param {Array.<{value, time, ...}>} objectArray - Array of keyframe objects to write. "comment" and "duration" attributes will be used to set some marker attributes.
 *  @param {AVLayer} targetLayer - Target layer.
 *  @param {Object} [maskObj] - [OPTIONAL] Mask indicating what object properties to persist into a marker value.
 */
EASS.Persistor.writeObjectArrayToLayerMarkers = function (objectArray, targetLayer, maskObj) {
	var markerArray = this.keyframeObjectArrayToMarkerValueArray(objectArray, maskObj);
	this.writeMarkerArrayToLayerMarkers(markerArray, targetLayer);
}

/** @function writeObjectArrayToCompositionMarkers
 *  Writes an array of keyframe objects as markers to a composition maker row.
 *	If no composition assigned, markers will be written to active composition if found.
 *
 *  @param {Array.<{value, time, ...}>} objectArray - Array of keyframe objects to write. "comment" and "duration" attributes will be used to set some marker attributes.
 *  @param {CompItem} [targetComp] - [OPTIONAL] Composition to write markers to. Will try to find active composition if omitted.
 *  @param {Object} [maskObj] - [OPTIONAL] Mask indicating what object properties to persist into a marker value.
 */
EASS.Persistor.writeObjectArrayToCompositionMarkers = function (objectArray, targetComp, maskObj) {
	var markerArray = this.keyframeObjectArrayToMarkerValueArray(objectArray, maskObj);
	this.writeMarkerArrayToCompositionMarkers(markerArray, targetComp);
}

/** @function writeMarkerArrayToLayerMarkers
 *  Writes an array of MarkerValue objects to a layer's markers property.
 *
 *  @param {Array.<MarkerValue>} markerArray - Array of MarkerValue objects to write.
 *  @param {AVLayer} targetLayer - Target layer.
 */
EASS.Persistor.writeMarkerArrayToLayerMarkers = function (markerArray, targetLayer) {
	this.writeMarkerArrayToPropertyMarkers(markerArray, targetLayer.property("Marker"));
}

/** @function writeMarkerArrayToCompositionMarkers
 *  Writes an array of MarkerValue objects to a composition maker row.
 *	If no composition assigned, markers will be written to active composition if found.
 *
 *  @param {Array.<MarkerValue>} markerArray - Array of MarkerValue objects to write.
 *  @param {CompItem} [targetComp] - [OPTIONAL] Composition to write markers to. Will try to find active composition if omitted.
 */
EASS.Persistor.writeMarkerArrayToCompositionMarkers = function (markerArray, targetComp) {
	if (targetComp === undefined || targetComp === null) {
		targetComp = this.getActiveComposition();
	}

	/*TO-DO*/ /*FIX*/ //Find a proper way to access a composition's markers
	this.writeMarkerArrayToPropertyMarkers(markerArray, targetComp.layer("Marker"));
}

/** @function writeMarkerArrayToPropertyMarkers
 *  Writes an array of MarkerValue objects to a target property.
 *	Property should correspond to a marker property.
 *
 *  @param {Array.<MarkerValue>} markerArray - Array of MarkerValue objects to write.
 *  @param {AVLayer} targetLayer - Target layer.
 */
EASS.Persistor.writeMarkerArrayToPropertyMarkers = function (markerArray, targetProp) {
	for (var i = 0, l = markerArray.length; i < l; i++) {
		//Delete the time from the marker parameters and rewrite them
		var markerParams = markerArray[i].getParameters();
		var markerTime = markerParams.time;
		delete markerParams.time;
		markerArray[i].setParameters(markerParams);
		//Write the marker object at the target time
		targetProp.setValueAtTime(markerTime, markerArray[i]);		
	}
}