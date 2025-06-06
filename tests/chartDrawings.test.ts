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

  describe('Drawing Groups', () => {
    describe('createDrawingGroup', () => {
      it('should create a drawing group with required properties', () => {
        const group = chartDrawings.createDrawingGroup({
          name: 'Test Group',
          symbol: 'BINANCE:BTCUSDT'
        });

        expect(group).toHaveProperty('id');
        expect(group.name).toBe('Test Group');
        expect(group.symbol).toBe('BINANCE:BTCUSDT');
        expect(group.currencyId).toBeNull();
        expect(group.unitId).toBeNull();
        expect(group.id).toMatch(/^[A-Za-z0-9]{6}$/);
      });

      it('should use provided ID if specified', () => {
        const customId = 'CUSTOM';
        const group = chartDrawings.createDrawingGroup({
          id: customId,
          name: 'Test Group',
          symbol: 'BINANCE:BTCUSDT'
        });

        expect(group.id).toBe(customId);
      });

      it('should throw error if name is missing', () => {
        expect(() => {
          chartDrawings.createDrawingGroup({
            symbol: 'BINANCE:BTCUSDT'
          });
        }).toThrow('Group name is required');
      });

      it('should throw error if symbol is missing', () => {
        expect(() => {
          chartDrawings.createDrawingGroup({
            name: 'Test Group'
          });
        }).toThrow('Symbol is required');
      });
    });

    describe('createDrawingSources', () => {
      it('should create drawing sources with drawings and groups', () => {
        const drawing = chartDrawings.createTrendLine({
          id: 'test-line',
          symbol: 'BINANCE:BTCUSDT',
          points: [
            { time_t: 1000000, offset: 0, price: 100, interval: '5' },
            { time_t: 2000000, offset: 0, price: 200, interval: '5' }
          ]
        });

        const group = chartDrawings.createDrawingGroup({
          name: 'Test Group',
          symbol: 'BINANCE:BTCUSDT'
        });

        const sources = chartDrawings.createDrawingSources({
          drawings: [drawing],
          groups: [group]
        });

        expect(sources).toHaveProperty('sources');
        expect(sources).toHaveProperty('drawing_groups');
        expect(sources).toHaveProperty('clientId');
        expect(Object.keys(sources.sources)).toHaveLength(1);
        expect(Object.keys(sources.drawing_groups)).toHaveLength(1);
        expect(sources.sources['test-line']).toEqual(drawing);
        expect(sources.drawing_groups[group.id]).toEqual(group);
      });

      it('should create drawing sources without groups', () => {
        const drawing = chartDrawings.createTrendLine({
          id: 'test-line',
          symbol: 'BINANCE:BTCUSDT',
          points: [
            { time_t: 1000000, offset: 0, price: 100, interval: '5' },
            { time_t: 2000000, offset: 0, price: 200, interval: '5' }
          ]
        });

        const sources = chartDrawings.createDrawingSources({
          drawings: [drawing]
        });

        expect(Object.keys(sources.sources)).toHaveLength(1);
        expect(Object.keys(sources.drawing_groups)).toHaveLength(0);
      });

      it('should throw error if drawings array is missing', () => {
        expect(() => {
          chartDrawings.createDrawingSources({});
        }).toThrow('Drawings array is required');
      });

      it('should throw error if drawings is not an array', () => {
        expect(() => {
          chartDrawings.createDrawingSources({
            drawings: 'not-an-array'
          });
        }).toThrow('Drawings array is required');
      });
    });

    describe('addDrawingToGroup', () => {
      it('should add groupId to a drawing', () => {
        const drawing = chartDrawings.createTrendLine({
          id: 'test-line',
          symbol: 'BINANCE:BTCUSDT',
          points: [
            { time_t: 1000000, offset: 0, price: 100, interval: '5' },
            { time_t: 2000000, offset: 0, price: 200, interval: '5' }
          ]
        });

        const groupId = 'test-group';
        const groupedDrawing = chartDrawings.addDrawingToGroup(drawing, groupId);

        expect(groupedDrawing.groupId).toBe(groupId);
        expect(groupedDrawing.id).toBe(drawing.id);
      });

      it('should throw error if drawing is invalid', () => {
        expect(() => {
          chartDrawings.addDrawingToGroup(null, 'group-id');
        }).toThrow('Valid drawing object is required');
      });

      it('should throw error if groupId is missing', () => {
        const drawing = { id: 'test' };
        expect(() => {
          chartDrawings.addDrawingToGroup(drawing, '');
        }).toThrow('Group ID is required');
      });
    });

    describe('getDrawingsByGroup', () => {
      it('should filter drawings by group ID', () => {
        const group1 = 'group1';
        const group2 = 'group2';
        
        const drawing1 = { id: 'draw1', groupId: group1 };
        const drawing2 = { id: 'draw2', groupId: group2 };
        const drawing3 = { id: 'draw3', groupId: group1 };
        const drawing4 = { id: 'draw4' }; // No group

        const sources = {
          sources: {
            'draw1': drawing1,
            'draw2': drawing2,
            'draw3': drawing3,
            'draw4': drawing4
          },
          drawing_groups: {}
        };

        const group1Drawings = chartDrawings.getDrawingsByGroup(sources, group1);
        const group2Drawings = chartDrawings.getDrawingsByGroup(sources, group2);

        expect(group1Drawings).toHaveLength(2);
        expect(group2Drawings).toHaveLength(1);
        expect(group1Drawings).toContain(drawing1);
        expect(group1Drawings).toContain(drawing3);
        expect(group2Drawings).toContain(drawing2);
      });

      it('should return empty array if no drawings in group', () => {
        const sources = {
          sources: {
            'draw1': { id: 'draw1', groupId: 'other-group' }
          },
          drawing_groups: {}
        };

        const result = chartDrawings.getDrawingsByGroup(sources, 'non-existent-group');
        expect(result).toHaveLength(0);
      });

      it('should throw error if sources data is invalid', () => {
        expect(() => {
          chartDrawings.getDrawingsByGroup(null, 'group-id');
        }).toThrow('Valid drawing sources data is required');
      });

      it('should throw error if groupId is missing', () => {
        const sources = { sources: {} };
        expect(() => {
          chartDrawings.getDrawingsByGroup(sources, '');
        }).toThrow('Group ID is required');
      });
    });

    describe('getDrawingGroups', () => {
      it('should return all drawing groups', () => {
        const group1 = { id: 'g1', name: 'Group 1' };
        const group2 = { id: 'g2', name: 'Group 2' };
        
        const sources = {
          sources: {},
          drawing_groups: {
            'g1': group1,
            'g2': group2
          }
        };

        const groups = chartDrawings.getDrawingGroups(sources);
        expect(groups).toHaveLength(2);
        expect(groups).toContain(group1);
        expect(groups).toContain(group2);
      });

      it('should return empty array if no groups', () => {
        const sources = { sources: {}, drawing_groups: {} };
        const groups = chartDrawings.getDrawingGroups(sources);
        expect(groups).toHaveLength(0);
      });

      it('should return empty array if drawing_groups is missing', () => {
        const sources = { sources: {} };
        const groups = chartDrawings.getDrawingGroups(sources);
        expect(groups).toHaveLength(0);
      });
    });

    describe('removeDrawingGroup', () => {
      it('should remove group and unassign drawings', () => {
        const groupId = 'test-group';
        const sources = {
          sources: {
            'draw1': { id: 'draw1', groupId: groupId },
            'draw2': { id: 'draw2', groupId: 'other-group' },
            'draw3': { id: 'draw3', groupId: groupId }
          },
          drawing_groups: {
            [groupId]: { id: groupId, name: 'Test Group' },
            'other-group': { id: 'other-group', name: 'Other Group' }
          }
        };

        const updated = chartDrawings.removeDrawingGroup(sources, groupId);

        expect(updated.drawing_groups[groupId]).toBeUndefined();
        expect(updated.drawing_groups['other-group']).toBeDefined();
        expect(updated.sources['draw1'].groupId).toBeUndefined();
        expect(updated.sources['draw2'].groupId).toBe('other-group');
        expect(updated.sources['draw3'].groupId).toBeUndefined();
      });

      it('should throw error if sources data is missing', () => {
        expect(() => {
          chartDrawings.removeDrawingGroup(null, 'group-id');
        }).toThrow('Drawing sources data is required');
      });

      it('should throw error if groupId is missing', () => {
        const sources = { sources: {}, drawing_groups: {} };
        expect(() => {
          chartDrawings.removeDrawingGroup(sources, '');
        }).toThrow('Group ID is required');
      });
    });
  });
});
