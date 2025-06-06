import { describe, it, expect, beforeEach } from 'vitest';
import DrawingParser from '../src/classes/DrawingParser';

// Sample response data from the provided example
const sampleResponse = {
  "success": true,
  "payload": {
    "sources": {
      "25FuOW": {
        "id": "25FuOW",
        "symbol": "BINANCE:UNIUSDT.P",
        "ownerSource": "_seriesId",
        "serverUpdateTime": 1749106516920,
        "state": {
          "type": "LineToolRectangle",
          "id": "25FuOW",
          "state": {
            "color": "rgba(8, 153, 129, 1)",
            "fillBackground": true,
            "backgroundColor": "rgba(248, 187, 208, 0.1939)",
            "linewidth": 1,
            "transparency": 50,
            "showLabel": true,
            "horzLabelsAlign": "center",
            "vertLabelsAlign": "top",
            "textColor": "rgba(255, 235, 59, 1)",
            "fontSize": 18,
            "bold": false,
            "italic": false,
            "extendLeft": false,
            "extendRight": false,
            "middleLine": {
              "showLine": true,
              "lineWidth": 1,
              "lineColor": "#9c27b0",
              "lineStyle": 2
            },
            "linestyle": 0,
            "symbolStateVersion": 2,
            "zOrderVersion": 2,
            "frozen": false,
            "title": "",
            "interval": "5",
            "symbol": "BINANCE:UNIUSDT.P",
            "currencyId": null,
            "unitId": null,
            "visible": true,
            "text": ""
          },
          "points": [
            {
              "time_t": 1748526300,
              "offset": 13,
              "price": 7.009,
              "interval": "5"
            },
            {
              "time_t": 1748525700,
              "offset": 0,
              "price": 6.899,
              "interval": "5"
            }
          ],
          "zorder": -35180,
          "ownerSource": "_seriesId",
          "linkKey": "vrPTpq4C3Ml3",
          "sharingMode": 1
        }
      },
      "I66Yuv": {
        "id": "I66Yuv",
        "symbol": "BINANCE:UNIUSDT.P",
        "ownerSource": "_seriesId",
        "serverUpdateTime": 1749188307618,
        "state": {
          "type": "LineToolTrendLine",
          "id": "I66Yuv",
          "state": {
            "linecolor": "rgba(242, 54, 69, 1)",
            "linewidth": 1,
            "linestyle": 0,
            "extendLeft": false,
            "extendRight": false,
            "leftEnd": 0,
            "rightEnd": 0,
            "showLabel": true,
            "horzLabelsAlign": "left",
            "vertLabelsAlign": "middle",
            "textcolor": "rgba(255, 235, 59, 1)",
            "fontsize": 16,
            "bold": false,
            "italic": false,
            "alwaysShowStats": true,
            "showMiddlePoint": true,
            "showPriceLabels": true,
            "showPriceRange": false,
            "showPercentPriceRange": false,
            "showPipsPriceRange": false,
            "showBarsRange": false,
            "showDateTimeRange": false,
            "showDistance": false,
            "showAngle": false,
            "statsPosition": 3,
            "snapTo45Degrees": true,
            "fixedSize": true,
            "adjustedToSplitTime": 1749188291.887,
            "symbolStateVersion": 2,
            "zOrderVersion": 2,
            "visible": true,
            "frozen": false,
            "symbol": "BINANCE:UNIUSDT.P",
            "currencyId": null,
            "unitId": null,
            "intervalsVisibilities": {
              "seconds": false,
              "daysTo": 5,
              "months": false
            },
            "title": "",
            "text": "",
            "interval": "5"
          },
          "points": [
            {
              "time_t": 1749165300,
              "offset": 0,
              "price": 6.424942779291553,
              "interval": "5"
            },
            {
              "time_t": 1749150000,
              "offset": 0,
              "price": 6.432217983651226,
              "interval": "5"
            }
          ],
          "zorder": -625,
          "ownerSource": "_seriesId",
          "linkKey": "odDQMdNpeYT2",
          "sharingMode": 1
        }
      },
      "5Eg8Ci": {
        "id": "5Eg8Ci",
        "symbol": "BINANCE:UNIUSDT.P",
        "ownerSource": "_seriesId",
        "serverUpdateTime": 1749178654407,
        "groupId": "9dPnET",
        "state": {
          "type": "LineToolPath",
          "id": "5Eg8Ci",
          "state": {
            "lineColor": "rgba(255, 235, 59, 0.8408)",
            "lineWidth": 1,
            "lineStyle": 0,
            "leftEnd": 0,
            "rightEnd": 0,
            "adjustedToSplitTime": 1749178652.96,
            "symbolStateVersion": 2,
            "zOrderVersion": 2,
            "visible": true,
            "frozen": false,
            "symbol": "BINANCE:UNIUSDT.P",
            "currencyId": null,
            "unitId": null,
            "title": "",
            "interval": "240",
            "intervalsVisibilities": {
              "seconds": false,
              "hoursTo": 4,
              "days": false,
              "daysTo": 3,
              "weeks": false,
              "months": false
            }
          },
          "points": [
            {
              "time_t": 1746907200,
              "offset": 0,
              "price": 7.586,
              "interval": "240"
            },
            {
              "time_t": 1746979200,
              "offset": 0,
              "price": 6.715,
              "interval": "240"
            }
          ],
          "zorder": -1875,
          "ownerSource": "_seriesId",
          "linkKey": "Ht8qd5X5oLmH",
          "sharingMode": 1
        }
      },
      "dUMWzJ": {
        "id": "dUMWzJ",
        "symbol": "BINANCE:UNIUSDT.P",
        "ownerSource": "_seriesId",
        "serverUpdateTime": 1749107304526,
        "state": {
          "type": "LineToolTable",
          "id": "dUMWzJ",
          "state": {
            "backgroundColor": "#0F0F0F",
            "borderColor": "#575757",
            "textColor": "rgba(255, 238, 88, 1)",
            "fontSize": 14,
            "horzAlign": "left",
            "anchored": false,
            "rowsCount": 3,
            "colsCount": 4,
            "cells": [
              ["3D笔趋势", "下跌中,3D笔HL破了", "3D趋势", "下跌中"],
              ["4H笔 HL", "已破", "3D HL", "已破"],
              ["4H笔 LH", "", "等待3D下跌完成,且4H起码要有3笔才行", ""]
            ],
            "columnWidths": [129.8231575886497, 129.8231575886497, 129.8231575886497, 120],
            "rowHeights": [50.2, 32, 68.4],
            "symbolStateVersion": 2,
            "zOrderVersion": 2,
            "frozen": false,
            "title": "",
            "interval": "240",
            "symbol": "BINANCE:UNIUSDT.P",
            "currencyId": null,
            "unitId": null,
            "visible": true
          },
          "points": [
            {
              "time_t": 1748937600,
              "offset": 0,
              "price": 8.135628036585357,
              "interval": "240"
            }
          ],
          "zorder": -33330,
          "ownerSource": "_seriesId",
          "linkKey": "XcojoEdDXd51",
          "sharingMode": 1
        }
      }
    },
    "drawing_groups": {
      "9dPnET": {
        "id": "9dPnET",
        "symbol": "BINANCE:UNIUSDT.P",
        "serverUpdateTime": 1749182472504,
        "name": "4H笔"
      }
    }
  }
};

describe('DrawingParser', () => {
  describe('parse', () => {
    it('should parse valid response successfully', () => {
      const result = DrawingParser.parse(sampleResponse);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('drawings');
      expect(result).toHaveProperty('groups');
      expect(result).toHaveProperty('raw');
      expect(Array.isArray(result.drawings)).toBe(true);
      expect(Array.isArray(result.groups)).toBe(true);
      expect(result.drawings.length).toBe(4);
      expect(result.groups.length).toBe(1);
    });

    it('should throw error for null/undefined response', () => {
      expect(() => DrawingParser.parse(null)).toThrow('Invalid response: response must be an object');
      expect(() => DrawingParser.parse(undefined)).toThrow('Invalid response: response must be an object');
      expect(() => DrawingParser.parse('string')).toThrow('Invalid response: response must be an object');
    });

    it('should throw error for unsuccessful response', () => {
      const unsuccessfulResponse = { success: false };
      expect(() => DrawingParser.parse(unsuccessfulResponse)).toThrow('Response indicates failure');
    });

    it('should throw error for response without payload', () => {
      const noPayloadResponse = { success: true };
      expect(() => DrawingParser.parse(noPayloadResponse)).toThrow('No payload in response');
    });
  });

  describe('parseDrawing', () => {
    it('should parse rectangle drawing correctly', () => {
      const rectangleDrawing = sampleResponse.payload.sources['25FuOW'];
      const result = DrawingParser.parseDrawing(rectangleDrawing);
      
      expect(result.id).toBe('25FuOW');
      expect(result.type).toBe('LineToolRectangle');
      expect(result.symbol).toBe('BINANCE:UNIUSDT.P');
      expect(result.points).toHaveLength(2);
      expect(result.points[0]).toEqual({
        time_t: 1748526300,
        offset: 13,
        price: 7.009,
        interval: '5'
      });
      expect(result.style.color).toBe('rgba(8, 153, 129, 1)');
      expect(result.style.fillBackground).toBe(true);
      expect(result.visible).toBe(true);
      expect(result.frozen).toBe(false);
    });

    it('should parse trend line drawing correctly', () => {
      const trendLineDrawing = sampleResponse.payload.sources['I66Yuv'];
      const result = DrawingParser.parseDrawing(trendLineDrawing);
      
      expect(result.id).toBe('I66Yuv');
      expect(result.type).toBe('LineToolTrendLine');
      expect(result.points).toHaveLength(2);
      expect(result.style.linecolor).toBe('rgba(242, 54, 69, 1)');
      expect(result.style.alwaysShowStats).toBe(true);
      expect(result.style.adjustedToSplitTime).toBe(1749188291.887);
    });

    it('should parse path drawing correctly', () => {
      const pathDrawing = sampleResponse.payload.sources['5Eg8Ci'];
      const result = DrawingParser.parseDrawing(pathDrawing);
      
      expect(result.id).toBe('5Eg8Ci');
      expect(result.type).toBe('LineToolPath');
      expect(result.groupId).toBe('9dPnET');
      expect(result.points).toHaveLength(2);
      expect(result.style.lineColor).toBe('rgba(255, 235, 59, 0.8408)');
      expect(result.style.intervalsVisibilities).toEqual({
        "seconds": false,
        "hoursTo": 4,
        "days": false,
        "daysTo": 3,
        "weeks": false,
        "months": false
      });
    });

    it('should parse table drawing correctly', () => {
      const tableDrawing = sampleResponse.payload.sources['dUMWzJ'];
      const result = DrawingParser.parseDrawing(tableDrawing);
      
      expect(result.id).toBe('dUMWzJ');
      expect(result.type).toBe('LineToolTable');
      expect(result.style.backgroundColor).toBe('#0F0F0F');
      expect(result.style.rowsCount).toBe(3);
      expect(result.style.colsCount).toBe(4);
      expect(result.style.cells).toHaveLength(3);
      expect(result.style.cells[0]).toEqual(['3D笔趋势', '下跌中,3D笔HL破了', '3D趋势', '下跌中']);
    });

    it('should throw error for invalid drawing', () => {
      expect(() => DrawingParser.parseDrawing(null)).toThrow('Invalid drawing: missing state');
      expect(() => DrawingParser.parseDrawing({})).toThrow('Invalid drawing: missing state');
      expect(() => DrawingParser.parseDrawing({ id: 'test' })).toThrow('Invalid drawing: missing state');
    });
  });

  describe('parsePoints', () => {
    it('should parse points correctly', () => {
      const points = [
        {
          "time_t": 1748526300,
          "offset": 13,
          "price": 7.009,
          "interval": "5"
        },
        {
          "time_t": 1748525700,
          "price": 6.899,
          "interval": "5"
        }
      ];
      
      const result = DrawingParser.parsePoints(points);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        time_t: 1748526300,
        offset: 13,
        price: 7.009,
        interval: '5'
      });
      expect(result[1]).toEqual({
        time_t: 1748525700,
        offset: 0, // Default offset
        price: 6.899,
        interval: '5'
      });
    });

    it('should handle empty points array', () => {
      const result = DrawingParser.parsePoints([]);
      expect(result).toEqual([]);
    });
  });

  describe('parseDrawingGroups', () => {
    it('should parse drawing groups correctly', () => {
      const groups = sampleResponse.payload.drawing_groups;
      const result = DrawingParser.parseDrawingGroups(groups);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '9dPnET',
        symbol: 'BINANCE:UNIUSDT.P',
        serverUpdateTime: 1749182472504,
        name: '4H笔'
      });
    });

    it('should handle empty groups object', () => {
      const result = DrawingParser.parseDrawingGroups({});
      expect(result).toEqual([]);
    });
  });

  describe('filter methods', () => {
    let drawings;

    beforeEach(() => {
      const parsed = DrawingParser.parse(sampleResponse);
      drawings = parsed.drawings;
    });

    it('filterByType should filter drawings by type', () => {
      const rectangles = DrawingParser.filterByType(drawings, 'LineToolRectangle');
      const trendLines = DrawingParser.filterByType(drawings, 'LineToolTrendLine');
      
      expect(rectangles).toHaveLength(1);
      expect(rectangles[0].type).toBe('LineToolRectangle');
      expect(trendLines).toHaveLength(1);
      expect(trendLines[0].type).toBe('LineToolTrendLine');
    });

    it('filterBySymbol should filter drawings by symbol', () => {
      const uniDrawings = DrawingParser.filterBySymbol(drawings, 'BINANCE:UNIUSDT.P');
      const otherDrawings = DrawingParser.filterBySymbol(drawings, 'OTHER:SYMBOL');
      
      expect(uniDrawings).toHaveLength(4);
      expect(otherDrawings).toHaveLength(0);
    });

    it('filterByGroup should filter drawings by group ID', () => {
      const groupedDrawings = DrawingParser.filterByGroup(drawings, '9dPnET');
      const ungroupedDrawings = DrawingParser.filterByGroup(drawings, 'nonexistent');
      
      expect(groupedDrawings).toHaveLength(1);
      expect(groupedDrawings[0].groupId).toBe('9dPnET');
      expect(ungroupedDrawings).toHaveLength(0);
    });
  });

  describe('getSummary', () => {
    it('should generate correct summary statistics', () => {
      const parsed = DrawingParser.parse(sampleResponse);
      const summary = DrawingParser.getSummary(parsed.drawings);
      
      expect(summary.total).toBe(4);
      expect(summary.visible).toBe(4);
      expect(summary.frozen).toBe(0);
      expect(summary.grouped).toBe(1);
      
      expect(summary.typeCount).toEqual({
        'LineToolRectangle': 1,
        'LineToolTrendLine': 1,
        'LineToolPath': 1,
        'LineToolTable': 1
      });
      
      expect(summary.symbolCount).toEqual({
        'BINANCE:UNIUSDT.P': 4
      });
      
      expect(summary.groupCount).toEqual({
        '9dPnET': 1
      });
    });

    it('should handle empty drawings array', () => {
      const summary = DrawingParser.getSummary([]);
      
      expect(summary.total).toBe(0);
      expect(summary.visible).toBe(0);
      expect(summary.frozen).toBe(0);
      expect(summary.grouped).toBe(0);
      expect(summary.typeCount).toEqual({});
      expect(summary.symbolCount).toEqual({});
      expect(summary.groupCount).toEqual({});
    });
  });

  describe('DRAWING_TYPES constants', () => {
    it('should have correct drawing type constants', () => {
      expect(DrawingParser.DRAWING_TYPES.RECTANGLE).toBe('LineToolRectangle');
      expect(DrawingParser.DRAWING_TYPES.TREND_LINE).toBe('LineToolTrendLine');
      expect(DrawingParser.DRAWING_TYPES.PATH).toBe('LineToolPath');
      expect(DrawingParser.DRAWING_TYPES.TABLE).toBe('LineToolTable');
    });
  });

  describe('edge cases', () => {
    it('should handle drawing with minimal data', () => {
      const minimalDrawing = {
        id: 'test',
        symbol: 'TEST:SYMBOL',
        ownerSource: 'test',
        serverUpdateTime: 123456789,
        state: {
          type: 'LineToolRectangle',
          id: 'test',
          state: {},
          points: [],
          zorder: 0,
          linkKey: 'test',
          sharingMode: 1
        }
      };

      const result = DrawingParser.parseDrawing(minimalDrawing);
      
      expect(result.id).toBe('test');
      expect(result.type).toBe('LineToolRectangle');
      expect(result.points).toEqual([]);
      expect(result.title).toBe('');
      expect(result.text).toBe('');
      expect(result.visible).toBe(true); // Default value
    });

    it('should handle unknown drawing type', () => {
      const unknownDrawing = {
        id: 'unknown',
        symbol: 'TEST:SYMBOL',
        ownerSource: 'test',
        serverUpdateTime: 123456789,
        state: {
          type: 'UnknownDrawingType',
          id: 'unknown',
          state: {
            customProperty: 'value'
          },
          points: [],
          zorder: 0,
          linkKey: 'test',
          sharingMode: 1
        }
      };

      const result = DrawingParser.parseDrawing(unknownDrawing);
      
      expect(result.type).toBe('UnknownDrawingType');
      expect(result.style.customProperty).toBe('value');
    });
  });
});
