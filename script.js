   function ConverterCalculator() {
    const [activeConverter, setActiveConverter] = React.useState('Length');
    const [inputValue, setInputValue] = React.useState('');
    const [fromUnit, setFromUnit] = React.useState('');
    const [toUnit, setToUnit] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [sidebarVisible, setSidebarVisible] = React.useState(window.innerWidth > 768);
    const [fromSelectOpen, setFromSelectOpen] = React.useState(false);
    const [toSelectOpen, setToSelectOpen] = React.useState(false);
    const [chart, setChart] = React.useState(null);
    const [chartLabels, setChartLabels] = React.useState([]);
    const [chartData, setChartData] = React.useState([]);
    const [currencies, setCurrencies] = React.useState([]);
    const [exchangeRates, setExchangeRates] = React.useState({});
    const [isLoadingRates, setIsLoadingRates] = React.useState(false);

    const fromSelectRef = React.useRef(null);
    const toSelectRef = React.useRef(null);
    
    React.useEffect(() => {
    if (activeConverter === 'Currency') {
        fetchCurrencies();
    }

    if (chart) {
        chart.destroy();
    }
    setChart(null);
    setChartLabels([]);
    setChartData([]);
    setResult(null);
}, [activeConverter]);

    const fetchCurrencies = async () => {
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await response.json();
            const currencyList = Object.keys(data.rates);
            setCurrencies(currencyList);
            setExchangeRates(data.rates);
        } catch (error) {
            console.error('Error fetching currencies:', error);
            setResult('Error loading currencies. Please try again later.');
        }
    };

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (fromSelectRef.current && !fromSelectRef.current.contains(event.target)) {
                setFromSelectOpen(false);
            }
            if (toSelectRef.current && !toSelectRef.current.contains(event.target)) {
                setToSelectOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

            const converterTypes = [
                { name: 'Length', icon: 'fas fa-ruler' },
                { name: 'Area', icon: 'fas fa-vector-square' },
                { name: 'Volume', icon: 'fas fa-cube' },
                { name: 'Temperature', icon: 'fas fa-thermometer-half' },
                { name: 'Speed', icon: 'fas fa-tachometer-alt' },
                { name: 'Time', icon: 'far fa-clock' },
                { name: 'Mass', icon: 'fas fa-weight-hanging' },
                { name: 'Digital Storage', icon: 'fas fa-database' },
                { name: 'Energy', icon: 'fas fa-bolt' },
                { name: 'Pressure', icon: 'fas fa-compress-arrows-alt' },
                { name: 'Currency', icon: 'fas fa-money-bill-wave' },
            ];

            const unitOptions = {
                Length: {
                    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
                    conversions: {
                        Meters: {
                            Kilometers: (val) => val / 1000,
                            Centimeters: (val) => val * 100,
                            Millimeters: (val) => val * 1000,
                            Miles: (val) => val * 0.000621371,
                            Yards: (val) => val * 1.09361,
                            Feet: (val) => val * 3.28084,
                            Inches: (val) => val * 39.3701
                        }
                    }
                },
                Area: {
                    units: ['Square Meters', 'Square Kilometers', 'Square Miles', 'Square Yards', 'Square Feet', 'Hectares', 'Acres'],
                    conversions: {
                        'Square Meters': {
                            'Square Kilometers': (val) => val / 1000000,
                            'Square Miles': (val) => val * 3.861e-7,
                            'Square Yards': (val) => val * 1.19599,
                            'Square Feet': (val) => val * 10.7639,
                            'Hectares': (val) => val / 10000,
                            'Acres': (val) => val * 0.000247105
                        }
                    }
                },
                Volume: {
                    units: ['Cubic Meters', 'Liters', 'Milliliters', 'Gallons', 'Quarts', 'Pints', 'Cups'],
                    conversions: {
                        Liters: {
                            'Cubic Meters': (val) => val / 1000,
                            'Milliliters': (val) => val * 1000,
                            'Gallons': (val) => val * 0.264172,
                            'Quarts': (val) => val * 1.05669,
                            'Pints': (val) => val * 2.11338,
                            'Cups': (val) => val * 4.22675
                        }
                    }
                },
                Temperature: {
                    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
                    conversions: {
                        Celsius: {
                            Fahrenheit: (val) => (val * 9/5) + 32,
                            Kelvin: (val) => val + 273.15
                        },
                        Fahrenheit: {
                            Celsius: (val) => (val - 32) * 5/9,
                            Kelvin: (val) => (val - 32) * 5/9 + 273.15
                        },
                        Kelvin: {
                            Celsius: (val) => val - 273.15,
                            Fahrenheit: (val) => (val - 273.15) * 9/5 + 32
                        }
                    }
                },
                Speed: {
                    units: ['Meters per Second', 'Kilometers per Hour', 'Miles per Hour', 'Knots'],
                    conversions: {
                        'Meters per Second': {
                            'Kilometers per Hour': (val) => val * 3.6,
                            'Miles per Hour': (val) => val * 2.23694,
                            'Knots': (val) => val * 1.94384
                        }
                    }
                },
                Time: {
                    units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'],
                    conversions: {
                        Seconds: {
                            Minutes: (val) => val / 60,
                            Hours: (val) => val / 3600,
                            Days: (val) => val / 86400,
                            Weeks: (val) => val / 604800,
                            Months: (val) => val / 2628000,
                            Years: (val) => val / 31536000
                        }
                    }
                },
                Mass: {
                    units: ['Kilograms', 'Grams', 'Milligrams', 'Metric Tons', 'Pounds', 'Ounces'],
                    conversions: {
                        Kilograms: {
                            Grams: (val) => val * 1000,
                            Milligrams: (val) => val * 1000000,
                            'Metric Tons': (val) => val / 1000,
                            Pounds: (val) => val * 2.20462,
                            Ounces: (val) => val * 35.274
                        }
                    }
                },
                'Digital Storage': {
                units: ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes'],
                conversions: {
                    Bytes: {
                        Kilobytes: (val) => val / 1024,
                        Megabytes: (val) => val / (1024 * 1024),
                        Gigabytes: (val) => val / (1024 * 1024 * 1024),
                        Terabytes: (val) => val / (1024 * 1024 * 1024 * 1024),
                        Petabytes: (val) => val / (1024 * 1024 * 1024 * 1024 * 1024)
                    }
                }
            },
            Energy: {
                units: ['Joules', 'Kilojoules', 'Calories', 'Kilocalories', 'Watt-hours', 'Kilowatt-hours'],
                conversions: {
                    Joules: {
                        Kilojoules: (val) => val / 1000,
                        Calories: (val) => val / 4.184,
                        Kilocalories: (val) => val / 4184,
                        'Watt-hours': (val) => val / 3600,
                        'Kilowatt-hours': (val) => val / 3600000
                    }
                }
            },
            Pressure: {
                units: ['Pascal', 'Kilopascal', 'Bar', 'PSI', 'Atmosphere'],
                conversions: {
                    Pascal: {
                        Kilopascal: (val) => val / 1000,
                        Bar: (val) => val / 100000,
                        PSI: (val) => val / 6894.76,
                        Atmosphere: (val) => val / 101325
                    }
                }
            },
            Currency: {
            units: currencies,
            conversions: {
                USD: exchangeRates
            }
        }
        };

        const convert = async () => {
        if (!inputValue || !fromUnit || !toUnit) {
            setResult('Please fill in all fields');
            return;
        }

        const value = parseFloat(inputValue);
        if (isNaN(value)) {
            setResult('Invalid input');
            return;
        }

        try {
            let convertedValue;

            if (activeConverter === 'Currency') {
                setIsLoadingRates(true);
                try {
                    const response = await fetch(`https://open.er-api.com/v6/latest/${fromUnit}`);
                    const data = await response.json();
                    convertedValue = value * data.rates[toUnit];
                    setIsLoadingRates(false);
                } catch (error) {
                    setIsLoadingRates(false);
                    setResult('Error fetching exchange rates');
                    return;
                }
            } else {
                    if (fromUnit === toUnit) {
                    convertedValue = value;
                } else if (activeConverter === 'Temperature') {
                    convertedValue = unitOptions.Temperature.conversions[fromUnit][toUnit](value);
                } else {
                    const baseUnit = unitOptions[activeConverter].units[0];
                    let valueInBaseUnit;

                    if (fromUnit === baseUnit) {
                        valueInBaseUnit = value;
                    } else {
                        const toBaseConversion = 1 / unitOptions[activeConverter].conversions[baseUnit][fromUnit](1);
                        valueInBaseUnit = value * toBaseConversion;
                    }

                    if (toUnit === baseUnit) {
                        convertedValue = valueInBaseUnit;
                    } else {
                        convertedValue = unitOptions[activeConverter].conversions[baseUnit][toUnit](valueInBaseUnit);
                    }
                }
            }

            setResult(`${value} ${fromUnit} = ${convertedValue.toFixed(6)} ${toUnit}`);

                    const newLabels = [fromUnit, toUnit];
                    const newData = [value, convertedValue];

                    if (chart) {
                        updateChart(chart, newLabels, newData);
                    } else {
                        const ctx = document.getElementById('conversionChart').getContext('2d');
                        const newChart = createChart(ctx, newLabels, newData);
                        setChart(newChart);
                    }

                } catch (error) {
                    setResult('Conversion not available');
                }
            };
    
    const CustomSelect = ({ value, onChange, options, isOpen, setIsOpen, reference, label }) => (
        <div className="custom-select-container" ref={reference}>
            <label>{label}</label>
            <div className={`custom-select ${isOpen ? 'open' : ''}`}>
                <div 
                    className="selected-value" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {value || 'Select unit'}
                    <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
                </div>
                {isOpen && (
                    <div className="options-container">
                        {options.map((option, index) => (
                            <div
                                key={option}
                                className={`option ${value === option ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                style={{ '--index': index }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

        return (
        <div className="app-container">
            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className="sidebar-header">
                    <h2>Converters</h2>
                    <button className="close-sidebar" onClick={() => setSidebarVisible(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                {converterTypes.map((type) => (
                    <div 
                        key={type.name}
                        className={`nav-item ${activeConverter === type.name ? 'active' : ''}`}
                        onClick={() => {
                            setActiveConverter(type.name);
                            setInputValue('');
                            setFromUnit('');
                            setToUnit('');
                            setResult(null);
                            if (window.innerWidth <= 768) {
                                setSidebarVisible(false);
                            }
                        }}
                    >
                        <i className={type.icon}></i>
                        <span>{type.name}</span>
                    </div>
                ))}
            </div>

            <main className="main-content">
              <header className="header">
                <button className="hamburger" onClick={() => setSidebarVisible(!sidebarVisible)}>
            <i className="fas fa-bars"></i>
            </button>
        <h1 className="header-title">
            <i className="fas fa-ruler"></i>
            UPCAL - Marjhun Baylon
        </h1>
        </header>
                
                <div className="converter-container">
                    <div className="converter-header">
                        <h2>{activeConverter} Conversion</h2>
                    </div>

                    <div className="input-group">
                        <label>Value</label>
                        <input
                            type="number"
                            className="converter-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter value"
                        />
                    </div>

                    <CustomSelect
                        label="From Unit"
                        value={fromUnit}
                        onChange={setFromUnit}
                        options={unitOptions[activeConverter].units}
                        isOpen={fromSelectOpen}
                        setIsOpen={setFromSelectOpen}
                        reference={fromSelectRef}
                    />

                    <CustomSelect
                        label="To Unit"
                        value={toUnit}
                        onChange={setToUnit}
                        options={unitOptions[activeConverter].units}
                        isOpen={toSelectOpen}
                        setIsOpen={setToSelectOpen}
                        reference={toSelectRef}
                    />

                    <button 
                        className="convert-btn"
                        onClick={convert}
                    >
                        Convert
                    </button>

                    {result && (
                        <div className="result">
                            <h3>Result</h3>
                            <p>{result}</p>
                        </div>
                    )}
                    <div className="chart-container">
                    <canvas id="conversionChart"></canvas>
                    </div>
                </div>
            </main>
        </div>
    );
}

    ReactDOM.render(
        <ConverterCalculator />,
        document.getElementById('root')
    );
