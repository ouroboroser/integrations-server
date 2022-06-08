require('./handleDataForVisualization/handleDataImport.js');

const { range, filter, map, saveDiagram, of, concatAll, fromFetch } = require('rxjs');
// const { fromFetch } = require('rxjs/fetch')
// const { concatAll } = require('rxjs/')
//const Rx = require('rxjs');

// test 1
// range(1, 20)
//   .pipe(
//     filter(x => x % 2 === 1),
//     map(x => x + x)
//   )
//   .subscribe(x => console.log(x));

// test 2
of(1, 2, 3, 4)
  .pipe(
    map(x => x + x)
  )
  .subscribe(x => console.log(x));

// test 3

// of(1, 2, 3)
//   .pipe(
//     map(id =>
//       fromFetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
//         selector: response => response.json()
//       })
//     ),
//     //concatAll()
//   )
//   .subscribe(todo => console.log(todo.title));
//   //.subscribe();

saveDiagram();