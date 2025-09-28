function Keys({ handleClick, angleMode }) {
  return (
    <div className="keys scientific">
      <button name="clear" onClick={handleClick} className="clear">
        Clear
      </button>
      <button name="backspace" onClick={handleClick} className="backspace">
        ⌫
      </button>
      <button name="angle-mode" onClick={handleClick} className="function">
        {angleMode.toUpperCase()}
      </button>
      <button name="pi" onClick={handleClick} className="constant">
        π
      </button>
      <button name="e" onClick={handleClick} className="constant">
        e
      </button>

      <button name="sqrt" onClick={handleClick} className="function">
        √x
      </button>
      <button name="square" onClick={handleClick} className="function">
        x²
      </button>
      <button name="power" onClick={handleClick} className="function">
        x^y
      </button>
      <button name="reciprocal" onClick={handleClick} className="function">
        1/x
      </button>
      <button name="factorial" onClick={handleClick} className="function">
        x!
      </button>

      <button name="sin" onClick={handleClick} className="function">
        sin
      </button>
      <button name="cos" onClick={handleClick} className="function">
        cos
      </button>
      <button name="tan" onClick={handleClick} className="function">
        tan
      </button>
      <button name="log" onClick={handleClick} className="function">
        log
      </button>
      <button name="ln" onClick={handleClick} className="function">
        ln
      </button>

      <button name="asin" onClick={handleClick} className="function">
        sin⁻¹
      </button>
      <button name="acos" onClick={handleClick} className="function">
        cos⁻¹
      </button>
      <button name="atan" onClick={handleClick} className="function">
        tan⁻¹
      </button>
      <button name="/" onClick={handleClick}>
        ÷
      </button>
      <button name="*" onClick={handleClick}>
        ×
      </button>

      <button name="7" onClick={handleClick}>
        7
      </button>
      <button name="8" onClick={handleClick}>
        8
      </button>
      <button name="9" onClick={handleClick}>
        9
      </button>
      <button name="/" onClick={handleClick}>
        ÷
      </button>
      <button name="*" onClick={handleClick}>
        ×
      </button>

      <button name="4" onClick={handleClick}>
        4
      </button>
      <button name="5" onClick={handleClick}>
        5
      </button>
      <button name="6" onClick={handleClick}>
        6
      </button>
      <button name="-" onClick={handleClick}>
        −
      </button>
      <button name="+" onClick={handleClick}>
        +
      </button>

      <button name="1" onClick={handleClick}>
        1
      </button>
      <button name="2" onClick={handleClick}>
        2
      </button>
      <button name="3" onClick={handleClick}>
        3
      </button>
      <button name="plusminus" onClick={handleClick} className="function">
        +/−
      </button>
      <button name="percent" onClick={handleClick} className="function">
        %
      </button>

      <button name="0" onClick={handleClick}>
        0
      </button>
      <button name="." onClick={handleClick}>
        .
      </button>
      <button name="=" onClick={handleClick} style={{ gridColumn: "span 3" }}>
        =
      </button>
    </div>
  );
}

export default Keys;
