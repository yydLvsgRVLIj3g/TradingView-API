/**
 * Drawing Parser for TradingView API
 * Parses raw drawing data from getDrawings response into structured objects
 */

/**
 * @typedef {Object} ParsedPoint
 * @prop {number} time_t Point X time position
 * @prop {number} price Point Y price position
 * @prop {number} offset Point offset
 * @prop {string} interval Time interval
 */

/**
 * @typedef {Object} ParsedDrawing
 * @prop {string} id Drawing ID
 * @prop {string} type Drawing type (LineToolRectangle, LineToolTrendLine, etc.)
 * @prop {string} symbol Symbol associated with the drawing
 * @prop {string} ownerSource Owner source identifier
 * @prop {number} serverUpdateTime Last update timestamp
 * @prop {ParsedPoint[]} points Array of drawing points
 * @prop {number} zorder Drawing Z-order
 * @prop {string} linkKey Drawing link key
 * @prop {number} sharingMode Sharing mode
 * @prop {Object} style Drawing style properties
 * @prop {string} [groupId] Group ID if drawing belongs to a group
 * @prop {string} [title] Drawing title
 * @prop {string} [text] Drawing text content
 * @prop {string} interval Drawing interval
 * @prop {boolean} visible Whether drawing is visible
 * @prop {boolean} frozen Whether drawing is frozen
 */

/**
 * @typedef {Object} ParsedDrawingGroup
 * @prop {string} id Group ID
 * @prop {string} symbol Symbol associated with the group
 * @prop {number} serverUpdateTime Last update timestamp
 * @prop {string} name Group name
 */

/**
 * @typedef {Object} ParsedDrawingsResponse
 * @prop {boolean} success Whether the response was successful
 * @prop {ParsedDrawing[]} drawings Array of parsed drawings
 * @prop {ParsedDrawingGroup[]} groups Array of parsed drawing groups
 * @prop {Object} raw Raw response data
 */

class DrawingParser {
  /**
   * Drawing type constants
   */
  static DRAWING_TYPES = {
    RECTANGLE: 'LineToolRectangle',
    TREND_LINE: 'LineToolTrendLine',
    PATH: 'LineToolPath',
    TABLE: 'LineToolTable',
    HORIZONTAL_LINE: 'LineToolHorzLine',
    VERTICAL_LINE: 'LineToolVertLine',
    PARALLEL_CHANNEL: 'LineToolParallelChannel',
    FIBONACCI_RETRACEMENT: 'LineToolFibRetracement',
    FIBONACCI_EXTENSION: 'LineToolFibExtension',
    ELLIPSE: 'LineToolEllipse',
    CIRCLE: 'LineToolCircle',
    ARROW: 'LineToolArrow',
    TEXT: 'LineToolText',
    NOTE: 'LineToolNote',
    CALLOUT: 'LineToolCallout',
  };

  /**
   * Parse raw getDrawings response into structured data
   * @param {Object} rawResponse - Raw response from getDrawings API
   * @returns {ParsedDrawingsResponse} Parsed drawings response
   */
  static parse(rawResponse) {
    if (!rawResponse || typeof rawResponse !== 'object') {
      throw new Error('Invalid response: response must be an object');
    }

    const { success, payload } = rawResponse;

    if (!success) {
      throw new Error('Response indicates failure');
    }

    if (!payload) {
      throw new Error('No payload in response');
    }

    const drawings = this.parseDrawings(payload.sources || {});
    const groups = this.parseDrawingGroups(payload.drawing_groups || {});

    return {
      success,
      drawings,
      groups,
      raw: rawResponse,
    };
  }

  /**
   * Parse drawings from sources object
   * @param {Object} sources - Sources object from API response
   * @returns {ParsedDrawing[]} Array of parsed drawings
   */
  static parseDrawings(sources) {
    return Object.values(sources).map(drawing => this.parseDrawing(drawing));
  }

  /**
   * Parse a single drawing
   * @param {Object} drawing - Raw drawing object
   * @returns {ParsedDrawing} Parsed drawing
   */
  static parseDrawing(drawing) {
    if (!drawing || !drawing.state) {
      throw new Error('Invalid drawing: missing state');
    }

    const { id, symbol, ownerSource, serverUpdateTime, groupId, state } = drawing;
    const { type, points, zorder, linkKey, sharingMode, state: innerState } = state;

    return {
      id,
      type,
      symbol,
      ownerSource,
      serverUpdateTime,
      points: this.parsePoints(points || []),
      zorder,
      linkKey,
      sharingMode,
      style: this.parseStyle(innerState || {}),
      groupId,
      title: innerState?.title || '',
      text: innerState?.text || '',
      interval: innerState?.interval || '',
      visible: innerState?.visible !== false,
      frozen: innerState?.frozen || false,
    };
  }

  /**
   * Parse drawing points
   * @param {Array} points - Array of point objects
   * @returns {ParsedPoint[]} Array of parsed points
   */
  static parsePoints(points) {
    return points.map(point => ({
      time_t: point.time_t,
      price: point.price,
      offset: point.offset || 0,
      interval: point.interval,
    }));
  }

  /**
   * Parse drawing style based on drawing type
   * @param {Object} state - Drawing state object
   * @returns {Object} Parsed style object
   */
  static parseStyle(state) {
    const baseStyle = {
      visible: state.visible !== false,
      frozen: state.frozen || false,
      symbolStateVersion: state.symbolStateVersion,
      zOrderVersion: state.zOrderVersion,
    };

    // Type-specific style parsing
    switch (state.type) {
      case this.DRAWING_TYPES.RECTANGLE:
        return {
          ...baseStyle,
          ...this.parseRectangleStyle(state),
        };
      case this.DRAWING_TYPES.TREND_LINE:
        return {
          ...baseStyle,
          ...this.parseTrendLineStyle(state),
        };
      case this.DRAWING_TYPES.PATH:
        return {
          ...baseStyle,
          ...this.parsePathStyle(state),
        };
      case this.DRAWING_TYPES.TABLE:
        return {
          ...baseStyle,
          ...this.parseTableStyle(state),
        };
      default:
        return {
          ...baseStyle,
          ...state,
        };
    }
  }

  /**
   * Parse rectangle-specific style
   * @param {Object} state - Drawing state
   * @returns {Object} Rectangle style
   */
  static parseRectangleStyle(state) {
    return {
      color: state.color,
      fillBackground: state.fillBackground,
      backgroundColor: state.backgroundColor,
      linewidth: state.linewidth,
      transparency: state.transparency,
      showLabel: state.showLabel,
      horzLabelsAlign: state.horzLabelsAlign,
      vertLabelsAlign: state.vertLabelsAlign,
      textColor: state.textColor,
      fontSize: state.fontSize,
      bold: state.bold,
      italic: state.italic,
      extendLeft: state.extendLeft,
      extendRight: state.extendRight,
      middleLine: state.middleLine,
      linestyle: state.linestyle,
    };
  }

  /**
   * Parse trend line-specific style
   * @param {Object} state - Drawing state
   * @returns {Object} Trend line style
   */
  static parseTrendLineStyle(state) {
    return {
      linecolor: state.linecolor,
      linewidth: state.linewidth,
      linestyle: state.linestyle,
      extendLeft: state.extendLeft,
      extendRight: state.extendRight,
      leftEnd: state.leftEnd,
      rightEnd: state.rightEnd,
      showLabel: state.showLabel,
      horzLabelsAlign: state.horzLabelsAlign,
      vertLabelsAlign: state.vertLabelsAlign,
      textcolor: state.textcolor,
      fontsize: state.fontsize,
      bold: state.bold,
      italic: state.italic,
      alwaysShowStats: state.alwaysShowStats,
      showMiddlePoint: state.showMiddlePoint,
      showPriceLabels: state.showPriceLabels,
      showPriceRange: state.showPriceRange,
      showPercentPriceRange: state.showPercentPriceRange,
      showPipsPriceRange: state.showPipsPriceRange,
      showBarsRange: state.showBarsRange,
      showDateTimeRange: state.showDateTimeRange,
      showDistance: state.showDistance,
      showAngle: state.showAngle,
      statsPosition: state.statsPosition,
      snapTo45Degrees: state.snapTo45Degrees,
      fixedSize: state.fixedSize,
      adjustedToSplitTime: state.adjustedToSplitTime,
      intervalsVisibilities: state.intervalsVisibilities,
    };
  }

  /**
   * Parse path-specific style
   * @param {Object} state - Drawing state
   * @returns {Object} Path style
   */
  static parsePathStyle(state) {
    return {
      lineColor: state.lineColor,
      lineWidth: state.lineWidth,
      lineStyle: state.lineStyle,
      leftEnd: state.leftEnd,
      rightEnd: state.rightEnd,
      adjustedToSplitTime: state.adjustedToSplitTime,
      intervalsVisibilities: state.intervalsVisibilities,
    };
  }

  /**
   * Parse table-specific style
   * @param {Object} state - Drawing state
   * @returns {Object} Table style
   */
  static parseTableStyle(state) {
    return {
      backgroundColor: state.backgroundColor,
      borderColor: state.borderColor,
      textColor: state.textColor,
      fontSize: state.fontSize,
      horzAlign: state.horzAlign,
      anchored: state.anchored,
      rowsCount: state.rowsCount,
      colsCount: state.colsCount,
      cells: state.cells,
      columnWidths: state.columnWidths,
      rowHeights: state.rowHeights,
    };
  }

  /**
   * Parse drawing groups
   * @param {Object} groups - Groups object from API response
   * @returns {ParsedDrawingGroup[]} Array of parsed groups
   */
  static parseDrawingGroups(groups) {
    return Object.values(groups).map(group => ({
      id: group.id,
      symbol: group.symbol,
      serverUpdateTime: group.serverUpdateTime,
      name: group.name,
    }));
  }

  /**
   * Filter drawings by type
   * @param {ParsedDrawing[]} drawings - Array of drawings
   * @param {string} type - Drawing type to filter by
   * @returns {ParsedDrawing[]} Filtered drawings
   */
  static filterByType(drawings, type) {
    return drawings.filter(drawing => drawing.type === type);
  }

  /**
   * Filter drawings by symbol
   * @param {ParsedDrawing[]} drawings - Array of drawings
   * @param {string} symbol - Symbol to filter by
   * @returns {ParsedDrawing[]} Filtered drawings
   */
  static filterBySymbol(drawings, symbol) {
    return drawings.filter(drawing => drawing.symbol === symbol);
  }

  /**
   * Filter drawings by group
   * @param {ParsedDrawing[]} drawings - Array of drawings
   * @param {string} groupId - Group ID to filter by
   * @returns {ParsedDrawing[]} Filtered drawings
   */
  static filterByGroup(drawings, groupId) {
    return drawings.filter(drawing => drawing.groupId === groupId);
  }

  /**
   * Get drawings summary statistics
   * @param {ParsedDrawing[]} drawings - Array of drawings
   * @returns {Object} Summary statistics
   */
  static getSummary(drawings) {
    const typeCount = {};
    const symbolCount = {};
    const groupCount = {};

    drawings.forEach(drawing => {
      // Count by type
      typeCount[drawing.type] = (typeCount[drawing.type] || 0) + 1;
      
      // Count by symbol
      symbolCount[drawing.symbol] = (symbolCount[drawing.symbol] || 0) + 1;
      
      // Count by group
      if (drawing.groupId) {
        groupCount[drawing.groupId] = (groupCount[drawing.groupId] || 0) + 1;
      }
    });

    return {
      total: drawings.length,
      visible: drawings.filter(d => d.visible).length,
      frozen: drawings.filter(d => d.frozen).length,
      grouped: drawings.filter(d => d.groupId).length,
      typeCount,
      symbolCount,
      groupCount,
    };
  }
}

module.exports = DrawingParser;
