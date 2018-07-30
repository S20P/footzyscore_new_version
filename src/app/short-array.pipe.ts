// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({name: 'array_Short'})
// export class  ArrayShort implements PipeTransform {
//   // transform(value: string): string {
//   //   let newStr: string = "";
//   //   for (var i = value.length - 1; i >= 0; i--) {
//   //     newStr += value.charAt(i);
//   //   }
//   //   return newStr;
//   // }

//   transform(array: Array<any>, args: string): Array<any> {
//     if (typeof args[0] === "undefined") {
//         return array;
//     }
//     let direction = args[0][0];
//     let column = args.replace('-','');
//     array.sort((a: any, b: any) => {
//         let left = Number(new Date(a[column]));
//         let right = Number(new Date(b[column]));
//         return (direction === "-") ? right - left : left - right;
//     });
//     return array;
// }

// }

import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({name: 'groupBy'})
// export class GroupByPipe implements PipeTransform {
//     transform(collection: Array<any>, property: string): Array<any> {
//         // prevents the application from breaking if the array of objects doesn't exist yet
//         if(!collection) {
//             return null;
//         }

//         const groupedCollection = collection.reduce((previous, current)=> {
//             if(!previous[current[property]]) {
//                 previous[current[property]] = [current];
//             } else {
//                 previous[current[property]].push(current);
//             }

//             return previous;
//         }, {});

//         // this will return an array of objects, each object containing a group of objects
//         return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
//     }
// }

@Pipe({
    name: 'orderBy_ace_desc'
})
export class GroupByPipe implements PipeTransform {
transform(array, orderBy, asc = true){
 
    if (!orderBy || orderBy.trim() == ""){
      return array;
    } 

    //ascending
    if (asc){
      return Array.from(array).sort((item1: any, item2: any) => { 
        return this.orderByComparator(item1[orderBy], item2[orderBy]);
      });
    }
    else{
      //not asc
      return Array.from(array).sort((item1: any, item2: any) => { 
        return this.orderByComparator(item2[orderBy], item1[orderBy]);
      });
    }

}

orderByComparator(a:any, b:any):number{

    if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
      //Isn't a number so lowercase the string to properly compare
      if(a.toLowerCase() < b.toLowerCase()) return -1;
      if(a.toLowerCase() > b.toLowerCase()) return 1;
    }
    else{
      //Parse strings as numbers to compare properly
      if(parseFloat(a) < parseFloat(b)) return -1;
      if(parseFloat(a) > parseFloat(b)) return 1;
     }

    return 0; //equal each other
}
}