function type(d) {
  // d.percentage = +d.percentage;
  return d;
}

function typeLanguage(row){
  return { label: row.language, value: row.percentage };
}

function typeStatus(row){
  return { label: row.status, value: row.percentage };
}

function parseDate(format, date) {
  var parse = d3.time.format(format).parse;
  return parse(date);
}

function key(d) {
  return d.data.label;
};

function cleanse(label) {
  return label.replace(/[+]/g, 'plus')
              .replace(/ /g, '_')
              .replace(/[#]/g, 'sharp')
              .replace(/[()./]/g, '');
}

function threshold(d) {
  return d.value > 1.6;
}


function midAngle(d){
  return d.startAngle + (d.endAngle - d.startAngle)/2;
}

var lightgray = '#FDFBF7';

var dueEvalDict = {
  nocont: 'No Detected Continuations',
  'eval': 'Presence of eval or with statements',
  lib: 'Promises Libraries',
  err: 'Syntax errors',
  fail: 'Failed to test',
  notest: 'No test provided',
  ok: 'Successful compilation',
}

var languageDict = {
  Cplusplus: 'C++',
  Csharp: 'C sharp',
  EmacsLisp: 'Emacs Lisp',
  VisualBasicNET: 'Visual Basic .NET',
  Bower: 'Bower (JS)',
  Clojares: 'Clojars (Clojure)',
  CPAN: 'CPAN (Perl)',
  CPAN_Search: 'CPAN (search)',
  CRAN: 'CRAN (R)',
  Crates: 'Crates.io (Rust)',
  Drupal: 'Drupal (php)',
  GoDoc: 'GoDoc (Go)',
  Hackage: 'Hackage (Haskell)',
  Hex: 'Hex.pm (Elixir/Erlang)',
  LuaRocks: 'LuaRocks (Lua)',
  Maven: 'Maven Central (Java)',
  MELPA: 'MELPA (Emacs)',
  nugets: 'nuget (.NET)',
  Packagist: 'Packagist (PHP)',
  Pear: 'Pear (PHP)',
  Perl6Eco: 'Perl 6 Ecosystem (perl 6)',
  PyPI: 'PyPI (Python)',
  Rubygems: 'Rubygems.org',
  npm: 'npm (node.js)'
}

var parent = d3.select('#charts');

// d3.csv('csv/blackduck-alltime.csv')
//   .row(typeLanguage)
//   .get(pieChartFactory(parent, 'blackduck-alltime'));

// d3.csv('csv/blackduck-2015.csv')
//   .row(typeLanguage)
//   .get(pieChartFactory(parent, 'blackduck-2015'));

// d3.csv('csv/stackoverflow-mostwanted.csv')
//   .row(typeLanguage)
//   .get(pieChartFactory(parent, 'stackoverflow-mostwanted'));

// d3.csv('csv/due-evaluation.csv')
//   .row(typeStatus)
//   .get(pieChartFactory(parent, 'due-evaluation', {dict: dueEvalDict}));

// d3.csv('csv/blackduck-languages.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%Y',row.date),
//       C: +row['C'],
//       Cplusplus: +row['C++'],
//       Java: +row['Java'],
//       Javascript: +row['Javascript'],
//       PHP: +row['PHP'],
//       XMLSchema: +row['XML Schema'],
//       Shell: +row['Shell'],
//       Autoconf: +row['Autoconf'],
//       Python: +row['Python'],
//       Ruby: +row['Ruby'],
//       Assembler: +row['Assembler'],
//       Perl: +row['Perl'],
//       Csharp: +row['C#'],
//       SQL: +row['SQL'],
//       Make: +row['Make']
//     };
//   })
//   .get(lineChartFactory(parent, 'blackduck-languages', {
//     yLabel: 'Tags',
//     yLabelPadding: 40,
//     dict: languageDict
//   }));

// d3.csv('csv/modulecounts.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%Y\/%m\/%d',row.date),
//       npm: +row['npm (node.js)'],
//       Maven: +row['Maven Central (Java)'],
//       Rubygems: +row['Rubygems.org'],
//       GoDoc: +row['GoDoc (Go)'],
//       Packagist: +row['Packagist (PHP)'],
//       PyPI: +row['PyPI'],
//       nugets: +row['nuget (.NET)'],
//       CPAN: +row['CPAN'],
//       // Bower: +row['Bower (JS)'],
//       // Clojares: +row['Clojars (Clojure)'],
//       // CPAN_Search: +row['CPAN (search)'],
//       // CRAN: +row['CRAN (R)'],
//       // Crates: +row['Crates.io (Rust)'],
//       // Drupal: +row['Drupal (php)'],
//       // Hackage: +row['Hackage (Haskell)'],
//       // Hex: +row['Hex.pm (Elixir/Erlang)'],
//       // LuaRocks: +row['LuaRocks (Lua)'],
//       // MELPA: +row['MELPA (Emacs)'],
//       // Pear: +row['Pear (PHP)'],
//       // Perl: +row['Perl 6 Ecosystem (perl 6)'],
//     };
//   })
//   .get(lineChartFactory(parent, 'modulecounts', {
//     yLabel: 'Modules',
//     yLabelPadding: 50,
//     dict: languageDict
//   }));

// d3.csv('csv/github-languages.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%Y',row.date),
//       Javascript: row['Javascript'],
//       Java: row['Java'],
//       Ruby: row['Ruby'],
//       PHP: row['PHP'],
//       Python: row['Python'],
//       CSS: row['CSS'],
//       Cplusplus: row['C++'],
//       Csharp: row['C#'],
//       C: row['C'],
//       ObjectiveC: row['Objective-C'],
//       Perl: row['Perl']
//       // HTML: row['HTML'],
//       // Shell: row['Shell'],
//       // VimL: row['VimL'],
//       // EmacsLisp: row['Emacs Lisp'],
//     };
//   })
//   .get(lineChartFactory(parent, 'github-languages', {
//     yLabel: 'Rank',
//     yLabelPadding: 10,
//     dict: languageDict,
//     inverse: true,
//     yDomain: [1, 10]
//   }));

// var lastRow = {
//   Javascript: 0,
//   C: 0,
//   Cplusplus: 0,
//   Java: 0,
//   PHP: 0,
//   Ruby: 0,
//   Python: 0,
//   SQL: 0,
// };

// d3.csv('csv/stackoverflow-tags.csv')
//   .row(function(row) {
//     return lastRow = {
//       date: parseDate('%Y%m',row.date),
//       Javascript: lastRow.Javascript + +row['Javascript'],
//       C: lastRow.C + +row['C'],
//       Cplusplus: lastRow.Cplusplus + +row['C++'],
//       Java: lastRow.Java + +row['Java'],
//       PHP: lastRow.PHP + +row['PHP'],
//       Ruby: lastRow.Ruby + +row['Ruby'],
//       Python: lastRow.Python + +row['Python'],
//       SQL: lastRow.SQL + +row['SQL']
//     };
//   })
//   .get(lineChartFactory(parent, 'stackoverflow-tags', {
//     yLabel: 'Tags',
//     yLabelPadding: 60,
//     dict: languageDict
//   }));

// d3.csv('csv/stackoverflow-languages.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%Y',row.date),
//       Javascript: +row['Javascript'],
//       SQL: +row['SQL'],
//       Java: +row['Java'],
//       Csharp: +row['C#'],
//       PHP: +row['PHP'],
//       Python: +row['Python'],
//       Cplusplus: +row['C'],
//       C: +row['C'],
//       Nodejs: +row['Node.js'],
//       AngularJS: +row['AngularJS'],
//       Ruby: +row['Ruby'],
//       ObjectiveC: +row['Objective-C']
//     };
//   })
//   .get(lineChartFactory(parent, 'stackoverflow-languages', {
//     yLabel: 'Percentage',
//     yLabelPadding: 40,
//     dict: languageDict
//   }));

// d3.csv('csv/tiobe.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%Y%m%d',row.date),
//       Javascript: +row['JavaScript'],
//       Java: +row['Java'],
//       C: +row['C'],
//       Cplusplus: +row['C++'],
//       Csharp: +row['C#'],
//       Python: +row['Python'],
//       PHP: +row['PHP'],
//       VisualBasicNET: +row['Visual Basic .NET'],
//       Assembler: +row['Assembly language'],
//       Ruby: +row['Ruby']
//     };
//   })
//   .get(lineChartFactory(parent, 'tiobe', {
//     yLabel: 'Percentages',
//     yLabelPadding: 10,
//     dict: languageDict
//   }));

// d3.csv('csv/Javascript-timeline.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%d\/%m\/%Y',row.date),
//       event: row.event
//     };
//   })
//   .get(timelineFactory(parent, 'javascript-timeline', {
//   }));

// d3.csv('csv/visit-count-service-1.csv')
//   .row(function(row) {
//     return {
//       date: parseDate('%m-%Y', row.date),
//       visits: row.visits
//     }
//   })
//   .get(lineChartFactory(parent, 'visits', {
//     yLabel: 'Visits',
//     yLabelPaddin: 30
//   }));
d3.csv('csv/loop.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'loop-timeline', {
  }))

d3.csv('csv/nexttick.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'nexttick-timeline', {
  }))

d3.csv('csv/sequential.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'sequential-timeline', {
  }))

d3.csv('csv/deported.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'deported-timeline', {
  }))


d3.csv('csv/parallel5.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'parallel5-timeline', {
  }))

d3.csv('csv/parallel50.csv')
  .row(function(row) {
    var start = +row.start;

    // console.log(row);

    var tick = {
      start: start,
      begin: +row.tick - start,
      end: +row.endTick - start
    }

    return tick;
  })
  .get(spanTimelineFactory(parent, 'parallel50-timeline', {
  }))

// d3.csv('csv/parallel500.csv')
//   .row(function(row) {
//     var start = +row.start;
// 
//     // console.log(row);
// 
//     var tick = {
//       start: start,
//       begin: +row.tick - start,
//       end: +row.endTick - start
//     }
// 
//     return tick;
//   })
//   .get(spanTimelineFactory(parent, 'parallel500-timeline', {
//   }))

/////////////////////////////////////////////////////////////////////
//   SpanTimeline
/////////////////////////////////////////////////////////////////////

function spanTimelineFactory(parent, name, options) {

  var options = options || {};
  options.margin = options.margin || {top: 20, right: 20, bottom: 20, left: 20};
  options.width = 600 - options.margin.left - options.margin.right;
  options.height = 200 - options.margin.top - options.margin.bottom;
  options.dict = options.dict || {};
  options.interline = options.interline || 30;
  // options.xDomain = function() {return undefined};
  // options.yDomain = function() {return undefined};

  return function (error, data) {
    if (error) throw error;


    var svg = parent
      .append('svg')
      .attr('width', options.width + options.margin.left + options.margin.right)
      .attr('height', options.height + options.margin.top + options.margin.bottom)
      .attr('class', 'chart')
      .attr('filename', name + '.svg')

    var ratio = 1.11; 
    var margin = 356;

      svg.append('rect')
      .attr('x', -margin * ratio / 2)
      .attr('y', 20)
      .attr('width', options.width + options.margin.left + options.margin.right + margin)
      .attr('height', options.height + options.margin.top + options.margin.bottom - 20)
      .attr('fill', lightgray)

      // svg.append('g');


    spanTimeline(svg, data, options);
  }
}

function spanTimeline(svg, data, options) {

  data = data.sort(function(a, b) {
    return a.begin - b.begin;
  })

  var x = d3.scale.linear()
      .range([0, options.width])
      .domain([0, 580])
      // .domain(d3.extent(data, function(d) { return d.begin; }));

  var y = d3.scale.linear()
      .range(options.inverse ? [0, options.height] : [options.height, 0]);


  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickPadding(8)


  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + options.height + ')')
      .call(xAxis);

  var offset = 0;

  var ticks = svg.selectAll('.ticks')
    .data(data)
    .enter()
    .append("rect")
      .attr('class', 'ticks')
      .attr('fill', 'rgba(0,0,0,.4)')
      .attr("width", function(d) {
        // return Math.max(x(d.end - d.begin), 1);
        return x(d.end - d.begin);
      })
      .attr("height", function(d) {
        return 4;
      })
      .attr("x", function(d) {
        return x(d.begin)
      })
      .attr('y', function(d) {
        return 30 + (6*offset++ % (20 * 6));
      });
      // .attr('y', options.height - 30);
}
