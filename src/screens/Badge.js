import React from 'react';
import {View, Text, SafeAreaView, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BadgeButton} from '../components';
import * as colors from '../themes/colors';

const BadgeCriterion = ({desc, label}) => {
  return (
    <View style={{...styled.criterionContainer}}>
      <Text style={styled.criterionDesc}> {desc}</Text>
      <Text style={styled.criterionLabel}> {label}</Text>
    </View>
  );
};

export const Badge = () => {
  const navigation = useNavigation();
  const onPressGoBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styled.header}>
        <Pressable onPress={onPressGoBack}>
          <Image style={styled.arrow} source={require('../assets/icons/LeftArrow.png')} />
        </Pressable>
        <Text style={styled.headerText}>뱃지</Text>
      </View>
      <View style={styled.sectionContainer}>
        <BadgeButton label="🟡 주의 운전자" detail="졸음 3회 | 누적 운전 23시간" />
      </View>
      <View style={styled.sectionContainer}>
        <Text style={styled.label}>뱃지 부여 기준</Text>
        <View style={{marginTop: 12}}>
          <BadgeCriterion desc="10시간 미만 졸음 0회" label="🟢 도로의 수호자" />
          <BadgeCriterion desc="10시간 미만 졸음 1회" label="🟠 경고 운전자" />
          <BadgeCriterion desc="10시간 미만 졸음 2회 이상" label="🔴 위험 운전자" />
          <BadgeCriterion desc="10시간 기준 졸음 0회" label="🟢 도로의 수호자" />
          <BadgeCriterion desc="10시간 기준 졸음 1회" label="🟡 주의 운전자" />

          <BadgeCriterion desc="10시간 기준 졸음 2회" label="🟠 경고 운전자" />
          <BadgeCriterion desc="10시간 기준 졸음 3회 이상" label="🔴 위험 운전자" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  criterionDesc: {
    color: colors.gray600,
  },
  criterionLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  criterionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray300,
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    fontSize: 24,
  },
  sectionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
});
