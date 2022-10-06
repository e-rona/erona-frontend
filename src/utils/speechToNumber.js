export const speechToNumber = word => {
  let number = 1;
  if (word == '일') {
    number = 1;
  } else if (word == '이' || word == '미') {
    number = 2;
  } else if (word == '삼' || word == '찬' || word == '참') {
    number = 3;
  } else if (word == '사' || word == '차') {
    number = 4;
  } else if (word == '오' || word == '오오') {
    number = 5;
  } else if (word == '육' || word == '유') {
    number = 6;
  } else if (word == '칠' || word == '책') {
    number = 7;
  } else if (word == '팔') {
    number = 8;
  } else if (word == '구') {
    number = 9;
  } else if (word == '십' || word == '집') {
    number = 10;
  }

  return number;
};
