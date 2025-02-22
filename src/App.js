import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]); // 모든 코인 데이터
  const [selectedCoin, setSelectedCoin] = useState(null); // 선택된 코인
  const [coinPrice, setCoinPrice] = useState(0); // 선택된 코인 가격
  const [amount, setAmount] = useState(""); // 사용자가 입력한 코인 개수
  const [convertedUsd, setConvertedUsd] = useState(null); // 변환된 USD 값

  // 📌 코인 데이터 불러오기
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("🚨 Error fetching data", error);
        setLoading(false);
      });
  }, []);

  // 📌 선택한 코인의 가격 가져오기
  const handleCoinChange = (event) => {
    const coinSymbol = event.target.value;
    const selected = coins.find((coin) => coin.symbol === coinSymbol);

    if (selected) {
      setSelectedCoin(selected);
      setCoinPrice(selected.quotes.USD.price);
      setConvertedUsd(null); // 새로운 코인을 선택하면 변환 결과 초기화
    }
  };

  // 📌 입력 값 변경 시 상태 업데이트 (⚠️ 수정된 부분)
  const handleAmountChange = (event) => {
    setAmount(event.target.value); // 🟢 `btcAmount`가 아니라 `amount`를 사용해야 함.
  };

  // 📌 버튼을 눌렀을 때 변환 결과를 저장 (⚠️ 수정된 부분)
  const handleConvert = () => {
    if (selectedCoin) {
      const usdValue = (parseFloat(amount) || 0) * coinPrice;
      setConvertedUsd(usdValue);
    }
  };

  return (
    <div>
      <h1>The Coins!</h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <>
          {/* 🟢 코인 선택 드롭다운 */}
          <select onChange={handleCoinChange}>
            <option value="">Select a coin</option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.symbol}>
                {coin.name} ({coin.symbol}): ${coin.quotes.USD.price.toFixed(2)}
              </option>
            ))}
          </select>

          {/* 🟢 선택한 코인 정보 표시 */}
          {selectedCoin && (
            <>
              <p>
                Selected Coin: <strong>{selectedCoin.name} ({selectedCoin.symbol})</strong>
              </p>
              <p>
                Current Price: <strong>${coinPrice.toLocaleString()}</strong>
              </p>
            </>
          )}

          {/* 🟢 코인 변환기 */}
          <h2>코인 변환 하기</h2>
          <p>
            {selectedCoin
              ? `선택한 코인 가격: $${coinPrice.toLocaleString()}`
              : "코인을 선택하세요"}
          </p>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount} 
            onChange={handleAmountChange} // ⚠️ `handleAmountChange`가 `amount`를 업데이트함.
          />
          {/* 변환 버튼 추가 */}
          <button type="button" onClick={handleConvert}>
            변환
          </button>

          {/* 변환된 USD 값 출력 (버튼 클릭 후에만 표시) */}
          {convertedUsd !== null && (
            <h3>
              {selectedCoin?.symbol} → USD: ${convertedUsd.toFixed(3).toLocaleString()}
            </h3>
          )}
        </>
      )}
    </div>
  );
}

export default App;
