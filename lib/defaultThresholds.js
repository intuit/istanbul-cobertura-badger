"use strict";

/**
 * The default thresholds to generate the appropriate color of the badge.
 * Green: coverage result >= thresholds.excellent;
 * Yellow: coverage result >= opts.thresholds.good < thresholds.excellent;
 * Red: coverage result < opts.thresholds.good.
 */
module.exports = {
  excellent: 90,
  good: 65
};
