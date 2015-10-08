"use strict";

module.exports = processReport;

/**
 * Processes the XML report based on the package.
 *
 * <package>...</package>
 *
 * @param {Object} xml is the parsed report.
 * @param {Object} computation is result of computation.
 */
function processReport(xml, computation) {
  if (xml.packages.package instanceof Array) {
    // Process all the packages
    xml.packages.package.forEach(function(packageObject) {
      processPackage(packageObject, computation);
    });

  } else {
    processPackage(xml.packages.package, computation);
  }
}

/**
 * Processes the individual package entry.
 *
 * <package><class></package>
 *
 * @param {Object} packageObject is the package object from the report.
 * @param {Object} computation is the result of the computation.
 */
function processPackage(packageObject, computation) {
  if (packageObject.classes.class instanceof Array) {
    // Process each individual class
    packageObject.classes.class.forEach(function(clazz) {
      processClass(clazz, computation);
    });

  } else {
    // Single class to be processed
    processClass(packageObject.classes.class, computation);
  }
}

/**
 * Processes the individual Class and compute totals.
 *
 * <class>...</class>
 *
 * @param {Object} clazz is the class object from the report.
 * @param {Object} computation is the result of the computation.
 */
function processClass(clazz, computation) {
  if (!clazz.methods.method) {
    return;
  }
  if (clazz.methods.method instanceof Array) {

    clazz.methods.method.forEach(function(method) {
      ++computation.total;
      // Incremente the total number of methods if there were hits. Don't increment for no hit
      computation.passed = parseInt(method.hits) > 0 ? ++computation.passed : computation.passed;
    });

  } else { // That's the method object itself.
    ++computation.total;
    computation.passed = parseInt(clazz.methods.method.hits) > 0 ? ++computation.passed : computation.passed;
  }
}
