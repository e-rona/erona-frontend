import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';

const landmarkSize = 2;

const FaceRecognition = () => {
  const navigation = useNavigation();
  const zoom = 0;
  const autoFocus = 'on';
  const ratio = '16:9';
  const [autoFocusPoint, setAutoFocusPoint] = useState({
    normalized: {x: 0.5, y: 0.5},
    drawRectPosition: {
      x: Dimensions.get('window').width * 0.5 - 32,
      y: Dimensions.get('window').height * 0.5 - 32,
    },
  });
  const [type, setType] = useState('front');
  const [detectFaces, setDetectFaces] = useState(false);
  const [face, setFace] = useState([]);
  const [sleepCount, setSleepCount] = useState(0);
  const [sleepDetect, setSleepDetect] = useState(false);
  const [detectCount, setDetectCount] = useState(0);
  const [alert, setAlert] = useState(false);
  const [executeTime, setExcuteTime] = useState(0);
  const [closeTime, setCloseTime] = useState(0);
  const [timer, setTimer] = useState();

  useEffect(() => {
    var now = new Date();
    setExcuteTime(now.getTime());
  }, []);

  useEffect(() => {
    var now = new Date();
    const elapsedMSec = now.getTime() - executeTime;
    const elapsedSec = elapsedMSec / 1000;
    console.log(elapsedSec, closeTime);
    let perclos = (closeTime / elapsedSec) * 100;
    if (elapsedSec > 60 && perclos > 30) {
      navigation.navigate('MathStackNavigator');
    }
  }, [closeTime, executeTime, navigation]);

  const sleeping = () => {
    setCloseTime(t => t + 1);
  };

  const facesDetected = ({faces}) => {
    if (!faces.length) {
      //실제 주행 중 운전자의 얼굴을 찾을 수 없는 경우, "운전자의 얼굴을 찾을 수 없습니다" "운전자의 눈을 찾을 수 없습니다" 라고 팝업 제시
      console.log('얼굴 인식 불가');
      setDetectCount(detectCount + 1);

      if (detectCount > 10) {
        setDetectCount(0);
        Alert.alert('얼굴 인식 불가', '운전자의 얼굴을 찾을 수 없습니다. 각도를 조절해주세요.', [{text: '확인', onPress: () => console.log('OK Pressed')}]);
      }
      return;
    } else {
      setDetectCount(0);
    }
    // console.log('face : ', faces[0].rollAngle, faces[0].yawAngle);
    const rightEye = faces[0].rightEyeOpenProbability;
    const leftEye = faces[0].leftEyeOpenProbability;
    const smileprob = faces[0].smilingProbability;
    const bothEyes = (rightEye + leftEye) / 2;

    // console.log(bothEyes);
    if (bothEyes < 0.5 && bothEyes >= 0.2) {
      //졸린상태
      console.log('조는중');
      if (!sleepDetect) {
        // var now = new Date();
        // setSleepCount(now.getTime());
        setSleepDetect(true);
        setTimer(setInterval(sleeping, 1000));
      }
      // if (sleepCount > 8) {
      //   setSleepCount(0);
      //   navigation.navigate('MathStackNavigator');
      // }
    } else if (bothEyes < 0.2) {
      //잠든상태
      console.log('자는중');
      if (!sleepDetect) {
        // var now = new Date();
        // setSleepCount(now.getTime());
        setSleepDetect(true);
        setTimer(setInterval(sleeping, 1000));
      }
      // if (sleepCount > 8) {
      //   setSleepCount(0);
      //   navigation.navigate('MathStackNavigator');
      // }
    } else {
      setSleepDetect(false);
      clearInterval(timer);
      // if (sleepDetect) {
      //   //   var now = new Date();
      //   //   console.log('눈감은 시간 : ', now.getTime() - sleepCount);
      //   //   setCloseTime(closeTime + now.getTime() - sleepCount);
      //   //   setSleepCount(null);

      //   clearInterval(timer);
      //   clearInterval(timer);
      // }
    }

    setFace([...faces]);
  };

  const renderFace = ({bounds, faceID, rollAngle, yawAngle, leftEyeOpenProbability, rightEyeOpenProbability, smilingProbability}) => (
    <View
      key={faceID}
      transform={[{perspective: 600}, {rotateZ: `${rollAngle.toFixed(0)}deg`}, {rotateY: `${yawAngle.toFixed(0)}deg`}]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}>
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>
        eyeOpenProbability:
        {leftEyeOpenProbability + rightEyeOpenProbability / 2}
      </Text>
      <Text style={styles.faceText}>smilingProbability: {smilingProbability}</Text>
    </View>
  );

  const renderLandmarksOfFace = face => {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  };

  const renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {face.map(renderFace)}
    </View>
  );

  const renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {face.map(renderLandmarksOfFace)}
    </View>
  );

  const renderCamera = () => {
    const drawFocusRingPosition = {
      top: autoFocusPoint.drawRectPosition.y - 32,
      left: autoFocusPoint.drawRectPosition.x - 32,
    };
    // handleFaceDetected = faceArray => {
    //   console.log('handleFaceDetected', faceArray);
    // };
    return (
      <RNCamera
        captureAudio={false}
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        type={type}
        zoom={zoom}
        ratio={ratio}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks ? RNCamera.Constants.FaceDetection.Landmarks.all : undefined}
        faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all ? RNCamera.Constants.FaceDetection.Classifications.all : undefined}
        onCameraReady={() => {
          console.log('onCameraReady');
          setDetectFaces(true);
        }}
        onFacesDetected={detectFaces ? facesDetected : null}
        onFaceDetectionError={error => console.log('FDError', error)} // This is never triggered
      />
    );
  };

  return alert ? (
    <View style={{flex: 1}}>
      <Text>졸음인지됨! 게임으로 넘어가기</Text>
    </View>
  ) : (
    <View style={styles.container}>{renderCamera()}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

export default FaceRecognition;
