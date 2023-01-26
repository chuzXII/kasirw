import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import React, {useRef, useState} from 'react';

const FloatingBtn = ({item}) => {
  const translation = useRef(new Animated.Value(0)).current;
  const [animationValue, setAnimationValue] = useState(new Animated.Value(0));
  const [Check, setCheck] = useState();

  toggleMenu = () => {
    if (Check) {
      Animated.spring(animationValue, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
      setCheck(!Check);
    } else {
      Animated.spring(animationValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
      setCheck(!Check);
    }
  };
  const pinStyle = {
    transform: [
      {scale: animationValue},
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
    ],
  };
  const thumbStyle = {
    transform: [
      {scale: animationValue},
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
    ],
  };
  const heartStyle = {
    transform: [
      {scale: animationValue},
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -200],
        }),
      },
    ],
  };
  const opacity = translation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const rotation = {
    transform: [
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Animated.View style={[styles.Fbutton, styles.secondary, heartStyle]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.Tbutton]}>{item}</Text>
            <Animated.View>
              <Text style={{color: '#9B5EFF', fontWeight: '500'}}>&#62;</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity>
        <Animated.View style={[styles.Fbutton(item), styles.secondary, thumbStyle]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.Tbutton]}>Mod</Text>
            <Animated.View>
              <Text style={{color: '#9B5EFF', fontWeight: '500'}}>&#62;</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.Fbutton(item), styles.secondary, pinStyle]}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.Tbutton]}>Pod</Text>
          <Animated.View>
            <Text style={{color: '#9B5EFF', fontWeight: '500'}}>&#62;</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleMenu()}>
        <Animated.View style={[styles.Fbutton(item), styles.menu, rotation]}>
          <Text>+</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingBtn;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    right: 0,
  },
  Fbutton:(item)=>( {
    position: 'absolute',
    bottom: 16,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  }),
  Tbutton: {
    position: 'absolute',
    bottom: -12,
    right: 40,
    padding: 12,
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
    borderColor: '#9B5EFF',
    borderWidth: 1,
  },
  menu: {
    backgroundColor: '#9B5EFF',
    borderColor: '#fff',
    borderWidth: 1,
  },
  secondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderColor: '#9B5EFF',
    borderWidth: 1,
  },
});
