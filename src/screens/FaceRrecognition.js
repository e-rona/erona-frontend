import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {RNCamera} from 'react-native-camera';

const landmarkSize = 2;

export default class FaceRecognition extends Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'front', // Camera Front or Back
    whiteBalance: 'auto',
    ratio: '16:9',
    canDetectFaces: false,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    blinkDetected: false,
    blinkedimage: null,
    sleepCount: 0,
    detectCount: 0,
    alert: false,
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  touchToFocus(event) {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: {x, y},
        drawRectPosition: {x: pageX, y: pageY},
      },
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  handleBlinkDetection = async function () {
    if (this.camera) {
      // const data = await this.camera.takePictureAsync();
      // console.warn('takePicture ', data);
      // this.setState({blinkedimage: data.path});
      console.log('blink detected');
    }
  };

  toggle = value => () => {
    this.setState(prevState => ({[value]: !prevState[value]}));
    console.log(value, this.state[`${value}`]);
  };

  facesDetected = ({faces}) => {
    if (!faces.length) {
      //실제 주행 중 운전자의 얼굴을 찾을 수 없는 경우, "운전자의 얼굴을 찾을 수 없습니다" "운전자의 눈을 찾을 수 없습니다" 라고 팝업 제시
      this.setState({detectCount: this.state.detectCount + 1});

      if (this.state.detectCount > 10) {
        this.setState({detectCount: 0});
        Alert.alert('얼굴 인식 불가', '얼굴 인식이 불가합니다. 각도를 조절해주세요.', [{text: '확인', onPress: () => console.log('OK Pressed')}]);
      }
      return;
    } else {
      this.setState({detectCount: 0});
    }
    // console.log('face : ', faces[0].rollAngle, faces[0].yawAngle);
    const rightEye = faces[0].rightEyeOpenProbability;
    const leftEye = faces[0].leftEyeOpenProbability;
    const smileprob = faces[0].smilingProbability;
    const bothEyes = (rightEye + leftEye) / 2;
    // console.log(
    //   JSON.stringify({
    //     rightEyeOpenProbability: rightEye,
    //     leftEyeOpenProbability: leftEye,
    //     smilingProbability: smileprob,
    //     blinkProb: bothEyes,
    //   }),
    // );

    console.log(bothEyes);
    if (bothEyes < 0.5 && bothEyes >= 0.2) {
      //졸린상태
      console.log('조는중');
      this.setState({sleepCount: this.state.sleepCount + 1});
      if (this.state.sleepCount > 8) {
        this.setState({sleepCount: 0});
        this.props.navigation.navigate('MathStackNavigator');
      }
      console.log(
        JSON.stringify({
          blinkDetected: 'blinkDetected',
          rightEyeOpenProbability: rightEye,
          leftEyeOpenProbability: leftEye,
        }),
      );
      this.setState({blinkDetected: true});
    } else if (bothEyes < 0.2) {
      //잠든상태
      console.log('자는중');
      this.setState({sleepCount: this.state.sleepCount + 1});
      if (this.state.sleepCount > 8) {
        this.setState({sleepCount: 0});
        this.props.navigation.navigate('MathStackNavigator');
      }
    } else {
      this.setState({sleepCount: 0});
    }
    if (this.state.blinkDetected && bothEyes >= 0.9) {
      this.handleBlinkDetection(faces);
      this.setState({blinkDetected: false});
    }
    this.setState({faces});
  };

  renderFace = ({bounds, faceID, rollAngle, yawAngle, leftEyeOpenProbability, rightEyeOpenProbability, smilingProbability}) => (
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

  renderLandmarksOfFace(face) {
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
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderCamera() {
    const {canDetectFaces} = this.state;

    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
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
        type={this.state.type}
        zoom={this.state.zoom}
        ratio={this.state.ratio}
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
          this.setState({canDetectFaces: true});
        }}
        onFacesDetected={this.state.canDetectFaces ? this.facesDetected : null}
        onFaceDetectionError={error => console.log('FDError', error)} // This is never triggered
      />
    );
  }

  render() {
    return this.state.alert ? (
      <View style={{flex: 1}}>
        <Text>졸음인지됨! 게임으로 넘어가기</Text>
      </View>
    ) : (
      <View style={styles.container}>{this.renderCamera()}</View>
    );
  }
}

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
