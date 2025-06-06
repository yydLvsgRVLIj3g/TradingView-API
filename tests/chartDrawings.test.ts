import { describe, it, expect, beforeEach } from 'vitest';
import ChartDrawings from '../src/classes/ChartDrawings';

describe('ChartDrawings', () => {
  let chartDrawings;
  
  const mockCredentials = {
    session: 'test_session',
    signature: 'test_signature',
    id: 12345,
  };

  beforeEach(() => {
    chartDrawings = new ChartDrawings(mockCredentials);
  });

  describe('Constructor', () => {
    it('should create instance with credentials', () => {
      expect(chartDrawings.credentials).toEqual(mockCredentials);
      expect(chartDrawings.baseURL).toBe('https://charts-storage.tradingview.com/charts-storage');
    });

    it('should create instance without credentials', () => {
      const drawingsWithoutCreds = new ChartDrawings({
        session: '',
        signature: '',
        id: 0
      });
      expect(drawingsWithoutCreds.credentials.session).toBe('');
    });
  });

  describe('generateDrawingId', () => {
    it('should generate a 6-character string', () => {
      const id = chartDrawings.generateDrawingId();
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(6);
      expect(id).toMatch(/^[A-Za-z0-9]{6}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = chartDrawings.generateDrawingId();
      const id2 = chartDrawings.generateDrawingId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateLinkKey', () => {
    it('should generate a 15-character string', () => {
      const linkKey = chartDrawings.generateLinkKey();
      expect(typeof linkKey).toBe('string');
      expect(linkKey).toHaveLength(15);
      expect(linkKey).toMatch(/^[A-Za-z0-9]{15}$/);
    });

    it('should generate unique link keys', () => {
      const key1 = chartDrawings.generateLinkKey();
      const key2 = chartDrawings.generateLinkKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('generateClientId', () => {
    it('should generate a client ID in the correct format', () => {
      const clientId = chartDrawings.generateClientId();
      expect(typeof clientId).toBe('string');
      expect(clientId).toMatch(/^[A-Za-z0-9]{6}\/\d\/[A-Za-z0-9]{6}$/);
    });
  });

  describe('createTrendLine', () => {
    const validOptions = {
      id: 'test123',
      symbol: 'BINANCE:BTCUSDT',
      points: [
        { time_t: 1649165300, offset: 0, price: 40000, interval: '5' },
        { time_t: 1649150000, offset: 0, price: 41000, interval: '5' },
      ],
    };

    it('should create a valid trend line with default values', () => {
      const trendLine = chartDrawings.createTrendLine(validOptions);
      
      expect(trendLine.id).toBe('test123');
      expect(trendLine.symbol).toBe('BINANCE:BTCUSDT');
      expect(trendLine.state.type).toBe('LineToolTrendLine');
      expect(trendLine.state.points).toEqual(validOptions.points);
      expect(trendLine.state.state.linecolor).toBe('rgba(242, 54, 69, 1)');
      expect(trendLine.state.state.linewidth).toBe(1);
      expect(trendLine.state.state.visible).toBe(true);
    });

    it('should create a trend line with custom style', () => {
      const customStyle = {
        linecolor: 'rgba(0, 255, 0, 1)',
        linewidth: 3,
        text: 'Custom Line',
        extendRight: true,
      };

      const trendLine = chartDrawings.createTrendLine({
        ...validOptions,
        style: customStyle,
      });

      expect(trendLine.state.state.linecolor).toBe('rgba(0, 255, 0, 1)');
      expect(trendLine.state.state.linewidth).toBe(3);
      expect(trendLine.state.state.text).toBe('Custom Line');
      expect(trendLine.state.state.extendRight).toBe(true);
    });

    it('should throw error when ID is missing', () => {
      const optionsWithoutId = {
        symbol: validOptions.symbol,
        points: validOptions.points,
      };
      
      expect(() => {
        chartDrawings.createTrendLine(optionsWithoutId as any);
      }).toThrow('Drawing ID is required');
    });

    it('should throw error when symbol is missing', () => {
      const optionsWithoutSymbol = {
        id: validOptions.id,
        points: validOptions.points,
      };
      
      expect(() => {
        chartDrawings.createTrendLine(optionsWithoutSymbol as any);
      }).toThrow('Symbol is required');
    });

    it('should throw error when points are missing', () => {
      const optionsWithoutPoints = {
        id: validOptions.id,
        symbol: validOptions.symbol,
      };
      
      expect(() => {
        chartDrawings.createTrendLine(optionsWithoutPoints as any);
      }).toThrow('Exactly 2 points are required');
    });

    it('should throw error when not exactly 2 points', () => {
      const optionsWithOnePoint = {
        ...validOptions,
        points: [{ time_t: 1649165300, offset: 0, price: 40000, interval: '5' }],
      };
      
      expect(() => {
        chartDrawings.createTrendLine(optionsWithOnePoint);
      }).toThrow('Exactly 2 points are required');

      const optionsWithThreePoints = {
        ...validOptions,
        points: [
          { time_t: 1649165300, offset: 0, price: 40000, interval: '5' },
          { time_t: 1649150000, offset: 0, price: 41000, interval: '5' },
          { time_t: 1649140000, offset: 0, price: 42000, interval: '5' },
        ],
      };
      
      expect(() => {
        chartDrawings.createTrendLine(optionsWithThreePoints);
      }).toThrow('Exactly 2 points are required');
    });

    it('should generate linkKey and set default properties', () => {
      const trendLine = chartDrawings.createTrendLine(validOptions);
      
      expect(typeof trendLine.state.linkKey).toBe('string');
      expect(trendLine.state.linkKey).toHaveLength(15);
      expect(trendLine.state.zorder).toBe(-625);
      expect(trendLine.state.sharingMode).toBe(1);
      expect(trendLine.state.ownerSource).toBe('_seriesId');
      expect(trendLine.currencyId).toBeNull();
      expect(trendLine.unitId).toBeNull();
    });

    it('should set current timestamp for lastUpdateTime and adjustedToSplitTime', () => {
      const beforeTime = Date.now();
      const trendLine = chartDrawings.createTrendLine(validOptions);
      const afterTime = Date.now();
      
      expect(trendLine.state.state.lastUpdateTime).toBeGreaterThanOrEqual(beforeTime);
      expect(trendLine.state.state.lastUpdateTime).toBeLessThanOrEqual(afterTime);
      
      expect(trendLine.state.state.adjustedToSplitTime).toBeGreaterThanOrEqual(beforeTime / 1000);
      expect(trendLine.state.state.adjustedToSplitTime).toBeLessThanOrEqual(afterTime / 1000);
    });
  });

  describe('Error handling for API methods', () => {
    it('should throw error for saveDrawings without layoutId', async () => {
      await expect(chartDrawings.saveDrawings()).rejects.toThrow('Layout ID is required');
    });

    it('should throw error for saveDrawings without drawing data', async () => {
      await expect(chartDrawings.saveDrawings('test')).rejects.toThrow('Drawing data with sources is required');
    });

    it('should throw error for saveDrawings with invalid drawing data', async () => {
      await expect(chartDrawings.saveDrawings('test', {})).rejects.toThrow('Drawing data with sources is required');
    });

    it('should throw error for getDrawings without layoutId', async () => {
      await expect(chartDrawings.getDrawings()).rejects.toThrow('Layout ID is required');
    });

    it('should throw error for getJWTToken without session', async () => {
      const drawingsWithoutSession = new ChartDrawings({
        session: '',
        signature: '',
        id: 0
      });
      await expect(drawingsWithoutSession.getJWTToken('test')).rejects.toThrow('Session credentials required for JWT token');
    });
  });

  describe('Integration test data validation', () => {
    it('should create drawing data that matches the expected API format', () => {
      const trendLine = chartDrawings.createTrendLine({
        id: 'I66Yuv',
        symbol: 'BINANCE:UNIUSDT.P',
        points: [
          { time_t: 1749165300, offset: 0, price: 6.424942779291553, interval: '5' },
          { time_t: 1749150000, offset: 0, price: 6.432217983651226, interval: '5' },
        ],
        style: {
          linecolor: 'rgba(242, 54, 69, 1)',
          textcolor: 'rgba(255, 235, 59, 1)',
          fontsize: 16,
        },
      });

      const drawingData = {
        sources: { [trendLine.id]: trendLine },
        drawing_groups: {},
        clientId: chartDrawings.generateClientId(),
      };

      // Validate structure matches expected API format
      expect(drawingData.sources).toBeDefined();
      expect(drawingData.drawing_groups).toBeDefined();
      expect(drawingData.clientId).toBeDefined();
      
      const source = drawingData.sources['I66Yuv'];
      expect(source.id).toBe('I66Yuv');
      expect(source.symbol).toBe('BINANCE:UNIUSDT.P');
      expect(source.state.type).toBe('LineToolTrendLine');
      expect(source.state.points).toHaveLength(2);
      expect(source.state.state.linecolor).toBe('rgba(242, 54, 69, 1)');
    });
  });
});
