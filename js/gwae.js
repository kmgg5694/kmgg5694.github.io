// 보흘 주역 이름풀이 4대 괘 연산 함수
// 원·형·이·정 공식: B+C, A+B, A+C, A+B+C
// 형격 하괘 → 상괘 기준 / 정격은 ÷6 / 나머지 셋은 ÷8

(function (global) {

  // ── 소성괘 매핑 ──────────────────────────────────────────
  // ÷8 나머지 (1~8, 0→8)
  const PALGWAE = {
    1: { name: '천', hanja: '天', symbol: '☰', lines: [1,1,1] },
    2: { name: '택', hanja: '澤', symbol: '☱', lines: [1,1,0] },
    3: { name: '화', hanja: '火', symbol: '☲', lines: [1,0,1] },
    4: { name: '뢰', hanja: '雷', symbol: '☳', lines: [1,0,0] },
    5: { name: '풍', hanja: '風', symbol: '☴', lines: [0,1,1] },
    6: { name: '수', hanja: '水', symbol: '☵', lines: [0,1,0] },
    7: { name: '산', hanja: '山', symbol: '☶', lines: [0,0,1] },
    8: { name: '지', hanja: '地', symbol: '☷', lines: [0,0,0] },
  };

  // ÷6 나머지 (1~6, 0→6) — 정격용
  const YUKGWAE = {
    1: PALGWAE[1], // 천
    2: PALGWAE[2], // 택
    3: PALGWAE[3], // 화
    4: PALGWAE[4], // 뢰
    5: PALGWAE[5], // 풍
    6: PALGWAE[6], // 수
  };

  // ── 64대성괘 이름표 ───────────────────────────────────────
  // 키: '상괘번호-하괘번호' (형격번호-각격번호)
  // 상괘(행) × 하괘(열) 순서로 구성
  const DAESEONGGWAE = {
    '1-1': '천천건(天天乾)',   '1-2': '천택리(天澤履)',   '1-3': '천화동인(天火同人)', '1-4': '천뢰무망(天雷无妄)',
    '1-5': '천풍구(天風姤)',   '1-6': '천수송(天水訟)',   '1-7': '천산둔(天山遯)',     '1-8': '천지비(天地否)',
    '2-1': '택천쾌(澤天夬)',   '2-2': '택택태(澤澤兌)',   '2-3': '택화혁(澤火革)',     '2-4': '택뢰수(澤雷隨)',
    '2-5': '택풍대과(澤風大過)','2-6': '택수곤(澤水困)',  '2-7': '택산함(澤山咸)',     '2-8': '택지췌(澤地萃)',
    '3-1': '화천대유(火天大有)','3-2': '화택규(火澤睽)',  '3-3': '화화리(火火離)',     '3-4': '화뢰서합(火雷噬嗑)',
    '3-5': '화풍정(火風鼎)',   '3-6': '화수미제(火水未濟)','3-7': '화산려(火山旅)',    '3-8': '화지진(火地晉)',
    '4-1': '뢰천대장(雷天大壯)','4-2': '뢰택귀매(雷澤歸妹)','4-3': '뢰화풍(雷火豊)',  '4-4': '뢰뢰진(雷雷震)',
    '4-5': '뢰풍항(雷風恒)',   '4-6': '뢰수해(雷水解)',   '4-7': '뢰산소과(雷山小過)', '4-8': '뢰지예(雷地豫)',
    '5-1': '풍천소축(風天小畜)','5-2': '풍택중부(風澤中孚)','5-3': '풍화가인(風火家人)', '5-4': '풍뢰익(風雷益)',
    '5-5': '풍풍손(風風巽)',   '5-6': '풍수환(風水渙)',   '5-7': '풍산점(風山漸)',     '5-8': '풍지관(風地觀)',
    '6-1': '수천수(水天需)',   '6-2': '수택절(水澤節)',   '6-3': '수화기제(水火旣濟)', '6-4': '수뢰둔(水雷屯)',
    '6-5': '수풍정(水風井)',   '6-6': '수수감(水水坎)',   '6-7': '수산건(水山蹇)',     '6-8': '수지비(水地比)',
    '7-1': '산천대축(山天大畜)','7-2': '산택손(山澤損)',  '7-3': '산화비(山火賁)',     '7-4': '산뢰이(山雷頤)',
    '7-5': '산풍고(山風蠱)',   '7-6': '산수몽(山水蒙)',   '7-7': '산산간(山山艮)',     '7-8': '산지박(山地剝)',
    '8-1': '지천태(地天泰)',   '8-2': '지택임(地澤臨)',   '8-3': '지화명이(地火明夷)', '8-4': '지뢰복(地雷復)',
    '8-5': '지풍승(地風升)',   '8-6': '지수사(地水師)',   '8-7': '지산겸(地山謙)',     '8-8': '지지곤(地地坤)',
  };

  // ── 획수 → 소성괘 변환 ───────────────────────────────────
  function toSoSeongGwae8(sum) {
    const r = sum % 8;
    return r === 0 ? 8 : r;
  }

  function toSoSeongGwae6(sum) {
    const r = sum % 6;
    return r === 0 ? 6 : r;
  }

  // ── skeleton.json 획수 조회 ───────────────────────────────
  // skeletonData: skeleton.json을 파싱한 배열
  function getStrokes(char, skeletonData) {
    const entry = skeletonData.find(function (e) { return e.char === char; });
    return entry ? entry.strokes : null;
  }

  // ── 메인 연산 함수 ────────────────────────────────────────
  /**
   * calculateBoheulGwae
   * @param {string} surname    성 한자 (1~2자)
   * @param {string} name1      이름 첫째 자 한자
   * @param {string} name2      이름 둘째 자 한자 (외자이면 null)
   * @param {Array}  skeletonData  skeleton.json 파싱 배열
   * @returns {object}
   */
  function calculateBoheulGwae(surname, name1, name2, skeletonData) {
    // 획수 합산
    function sumStrokes(chars) {
      var total = 0;
      for (var i = 0; i < chars.length; i++) {
        var s = getStrokes(chars[i], skeletonData);
        if (s === null) return null; // 미등록 한자
        total += s;
      }
      return total;
    }

    var surnameChars = surname.split('');
    var A = sumStrokes(surnameChars);
    var B = name1 ? getStrokes(name1, skeletonData) : 0;
    var C = name2 ? getStrokes(name2, skeletonData) : 0;

    if (A === null || B === null || C === null) {
      return { error: '획수를 찾을 수 없는 한자가 포함되어 있습니다.' };
    }

    // 4격 합산
    var wonSum  = B + C;          // 원격: B+C
    var hyeongSum = A + B;        // 형격: A+B
    var iSum    = A + C;          // 이격: A+C
    var jeongSum = A + B + C;     // 정격: A+B+C

    // 소성괘 도출
    var hyeongIdx = toSoSeongGwae8(hyeongSum); // 상괘 기준
    var wonIdx    = toSoSeongGwae8(wonSum);
    var iIdx      = toSoSeongGwae8(iSum);
    var jeongIdx  = toSoSeongGwae6(jeongSum);

    var sangGwae  = PALGWAE[hyeongIdx]; // 상괘 (형격)

    var wonGwae    = DAESEONGGWAE[hyeongIdx + '-' + wonIdx]   || '미정의';
    var hyeongGwae = DAESEONGGWAE[hyeongIdx + '-' + hyeongIdx] || '미정의';
    var iGwae      = DAESEONGGWAE[hyeongIdx + '-' + iIdx]     || '미정의';
    var jeongGwae  = DAESEONGGWAE[hyeongIdx + '-' + jeongIdx] || '미정의';

    return {
      input: {
        surname: surname,
        name1: name1,
        name2: name2 || '',
        A: A, B: B, C: C,
      },
      sums: {
        won: wonSum,
        hyeong: hyeongSum,
        i: iSum,
        jeong: jeongSum,
      },
      sangGwae: sangGwae,
      gwae: {
        원격: { idx: wonIdx,    sogwae: PALGWAE[wonIdx],   daegwae: wonGwae    },
        형격: { idx: hyeongIdx, sogwae: PALGWAE[hyeongIdx],daegwae: hyeongGwae },
        이격: { idx: iIdx,      sogwae: PALGWAE[iIdx],     daegwae: iGwae      },
        정격: { idx: jeongIdx,  sogwae: YUKGWAE[jeongIdx], daegwae: jeongGwae  },
      },
    };
  }

  // ── 공개 API ──────────────────────────────────────────────
  global.BoheulGwae = {
    calculateBoheulGwae: calculateBoheulGwae,
    getStrokes: getStrokes,
    PALGWAE: PALGWAE,
    DAESEONGGWAE: DAESEONGGWAE,
  };

})(typeof window !== 'undefined' ? window : global);
