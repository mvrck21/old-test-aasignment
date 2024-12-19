/* Есть склад спец. одежды разных размеров.

  store: Array<{ size: number, quantity: number}>

  К нам приходит заказ на спец. одежду

  order: Array<{ id: number, size: [s1: number] | [s1: number, s2: s1+1]  }>,

  в котором указывается для каждого рабочего его id: number и size: [s1: number] | [s1: number, s2: s1+1].

  То есть по каждому рабочему может быть указан либо один подходящий размер одежды, либо два, причем 2-ой размер только на 1 больше первого.

  Нужно написать функцию processOrder, которая бы на получила на вход:

  1) массив доступных размеров спец. одежды
  ==============================================    store: Array<{ size: number, quantity: number}>

  2) Заказ на спец. одежду для сотрудников:
  ==============================================    order: Array<{ id: number, size: [s1: number] | [s1: number, s2: s1+1]  }>


  На выходе функция должна выдать false, если на складе недостаточно одежды на обеспечение всех сотрудников,
  а если это возможно, то возвращала объект:
  ==============================================    {
  ==============================================      stats: Array<{size: number, quantity: number}>,
  ==============================================      assignment:  Array<{id: number, size: number}>
  ==============================================    }

  где stats - упорядоченный массив по возрастанию size массив размеров size и количества quantity выдаваемой одежды со склада;

  assignment - массив распределения одежды по сотрудникам, где id - идентификатор рабочего из order, size - выданный ему размер


  Для проверки работоспособности функции запустить runTests()

  @param store: Array<{ size: number, quantity: number}>
  @param order: Array<{ id: number, size: [s1: number] | [s1: number, s2: s1+1]  }>
  @return false | {
    stats: Array<{size: number, quantity: number}>,
    assignment:  Array<{id: number, size: number}>
  }

*/
function processOrder(store, order) {
  // код писать только внутри данной функции

  const requested = {};

  for (let orderItem of order) {
    const { size } = orderItem;

    const [firstSize, secondSize] = size;

    if (!(String(firstSize) in requested)) {
      requested[firstSize] = { required: 0, alternatives: 0 };
    }

    if (secondSize) {
      requested[firstSize].alternatives++;
      continue;
    }

    requested[firstSize].required++;
  }

  console.log(
    "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
  );
  console.log("store:");
  console.log(store);
  console.log("order:");
  console.log(order);
  console.log("requested:");
  console.log(requested);

  const assignment = [];
  const stats = [];

  for (let size in requested) {
    const requestedItem = requested[size];

    console.log("current requested item (size " + size + ")");
    console.log(requestedItem);

    const sizeInStore = store.find((item) => item.size === +size);

    console.log(`size in store:`);
    console.log(sizeInStore);

    // =============================================================================== на складе нет такого размера, но есть обязательные заказы
    if (!sizeInStore && requestedItem.required) {
      console.log(
        "93 nichego ne poluchitsya - na sklade net neobhodimogo kolichestva"
      );

      return false;
    }

    // =============================================================================== на складе нет такого размера, но остались НЕобязательные заказы
    if (!sizeInStore && requestedItem.alternatives) {
      let nextRequested = requested[+size + 1];

      console.log("next requested (" + (+size + 1) + ")");
      console.log(nextRequested);

      if (nextRequested) {
        nextRequested.required += requestedItem.alternatives;
        requestedItem.alternatives = 0;
        continue;
      }

      const nextSizeInStore = store.find((item) => item.size === +size + 1);

      console.log("nextSizeInStore:");
      console.log(nextSizeInStore);

      if (nextSizeInStore) {
        requested[+size + 1] = {
          required: requestedItem.alternatives,
          alternatives: 0,
        };

        requestedItem.alternatives = 0;

        console.log("requested");
        console.log(requested);

        continue;
      }

      console.log("========================= NICHEGO NE POLUCHITSYA !!!!");
      return false;
    }

    // излишки текущего размера на складе
    // отрицательное - нехватка
    // 0 - впритык
    // положительное - излишек
    const residues = sizeInStore.quantity - requestedItem.required;

    // console.log(
    //   `for size ${size} - requested: ${requestedItem.required} and in store: ${sizeInStore.quantity}`
    // );

    // console.log(residues);
    if (residues < 0) {
      console.log(
        "nichego ne poluchitsya - na sklade net neobhodimogo kolichestva"
      );

      return false;
    }

    let currentStat = stats.find((s) => s.size === +size);

    if (!currentStat) {
      currentStat = { size: +size, quantity: requestedItem.required };
    }

    console.log(
      `ostalos dlya tekushego: ${residues} i alternativ: ${requestedItem.alternatives}`
    );

    // сколько необязательных текущих размеров может еще обслужить склад
    if (residues && requestedItem.alternatives) {
      console.log("dd");

      // чего больше? лишних размеров и требуемых альтернативных размеров
      const giveNonRequired = Math.min(requestedItem.alternatives, residues);

      console.log(
        `will also give ${giveNonRequired} non required since residues is ${residues} and alternatives is ${requestedItem.alternatives}`
      );

      currentStat.quantity += giveNonRequired;

      const remindedAlternatives = requestedItem.alternatives - giveNonRequired;

      if (!remindedAlternatives) {
        continue;
      }

      console.log(
        `will put ${remindedAlternatives} item to size ${+size + 1} as required`
      );

      console.log(`now: ${requested[+size + 1].required}`);

      // console.log("" + requestedItem.alternatives - giveNonRequired);

      requestedItem.alternatives -= giveNonRequired;
      console.log(`after: ${requested[+size + 1].required}`);
    }

    // if (!residues && requestedItem.alternatives) {
    //   const nextRequested = requested[size + 1];

    //   if (!nextRequested) {
    //     requested[size + 1] = {
    //       required: requestedItem.alternatives,
    //       alternatives: 0,
    //     };
    //   } else {
    //     nextRequested.required += requestedItem.alternatives;
    //   }
    // }

    // console.log("zzzzzz");

    if (requestedItem.alternatives) {
      console.log("alternativnie ostalis");

      if (requested[+size + 1]) {
        requested[+size + 1].required += requestedItem.alternatives;
        requestedItem.alternatives = 0;
      } else {
        requested[+size + 1] = {
          required: requestedItem.alternatives,
          alternatives: 0,
        };
        requestedItem.alternatives = 0;
      }

      // console.log("======== requested updated:");
      // console.log(requested);

      // stats.push(currentStat);
    }

    // if(!residues && requestedItem.alternatives) {

    // }

    console.log("======== requested updated:");
    console.log(requested);

    stats.push(currentStat);
  }

  console.log("FINAL REQUESTED:");
  console.log(requested);
  console.log("FINAl STATS:");
  console.log(stats);

  // for (let n in needs) {
  //   const [sizeItem] = store.filter((item) => {
  //     return item.size === Number(n);
  //   });

  //   if (!sizeItem) {
  //     continue;
  //   }

  //   const difference = needs[n] - sizeItem.quantity;

  //   if (difference > alternatives[n]) {
  //     return false;
  //   }
  // }

  // const assignment = [];
  // const stats = [];

  // console.log("----------------------------------------");

  // ===============================================================================================
  // for (or of order) {
  //   const { id } = or;

  //   const { size } = or;

  //   let s;

  //   const storeItems = storeDub.filter((item) => size.includes(item.size));

  //   if (storeItems[0] && storeItems[0].quantity > 0) {
  //     s = storeItems[0].size;

  //     storeItems[0].quantity--;

  //     assignment.push({
  //       id,
  //       size: s,
  //     });
  //   } else {
  //     if (storeItems[1]) {
  //       s = storeItems[1].size;

  //       storeItems[1].quantity--;

  //       assignment.push({
  //         id,
  //         size: s,
  //       });
  //     }
  //   }
  //   // console.log("$$$$$$$$$$$$$$$$$$$$");
  //   // console.log(assignment);
  // }

  // ===============================================================================================

  //   console.log("$$$$$$$$$$$$$$$$$$$$");
  //   //   console.log(order);
  //   console.log("$$$$$$$$$$$$$$$$$$$$");

  // console.log("$$$$$$$$$$$$$$$$$$$$");
  // console.log(assignment);

  // for (let as of assignment) {
  //   const idx = stats.findIndex((stat) => stat.size === as.size);

  //   if (idx === -1) {
  //     stats.push({ size: as.size, quantity: 1 });
  //     continue;
  //   }

  //   stats[idx].quantity++;
  // }

  // return {
  //   stats,
  //   assignment,
  // };

  return false;
}

function compareNumericArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  arr1 = [...arr1].sort();

  arr2 = [...arr2].sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function compareArraysOfNumericArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let el1 of arr1) {
    if (arr2.findIndex((el2) => compareNumericArrays(el1, el2)) < 0) {
      return false;
    }
  }

  return true;
}

runTests();

function runTests() {
  const tests = [
    {
      store: [
        {
          size: 2,
          quantity: 1,
        },
      ],

      order: [
        {
          id: 102,
          size: [1, 2],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 3,
          quantity: 1,
        },
      ],

      order: [
        {
          id: 102,
          size: [1, 2],
        },
      ],

      isPosible: false,
    },

    {
      store: [
        {
          size: 2,
          quantity: 4,
        },
      ],

      order: [
        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [1, 2],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 2,
          quantity: 1,
        },
      ],

      order: [
        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [1, 2],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 3,
          quantity: 1,
        },
      ],

      order: [
        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [1, 2],
        },
      ],

      isPosible: false,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 2,
          quantity: 2,
        },
        {
          size: 3,
          quantity: 1,
        },
      ],

      order: [
        {
          id: 100,
          size: [1],
        },

        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [2, 3],
        },

        {
          id: 103,
          size: [1, 2],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 2,
          quantity: 2,
        },
        {
          size: 3,
          quantity: 1,
        },
        {
          size: 4,
          quantity: 2,
        },
      ],

      order: [
        {
          id: 100,
          size: [1],
        },

        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [2, 3],
        },

        {
          id: 103,
          size: [1, 2],
        },

        {
          id: 104,
          size: [4],
        },

        {
          id: 105,
          size: [3, 4],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 2,
          quantity: 1,
        },
        {
          size: 3,
          quantity: 2,
        },
        {
          size: 4,
          quantity: 2,
        },
      ],

      order: [
        {
          id: 100,
          size: [1],
        },

        {
          id: 101,
          size: [2],
        },

        {
          id: 102,
          size: [2, 3],
        },

        {
          id: 103,
          size: [1, 2],
        },

        {
          id: 104,
          size: [4],
        },

        {
          id: 105,
          size: [3, 4],
        },
      ],

      isPosible: false,
    },

    {
      store: [
        {
          size: 1,
          quantity: 1,
        },
        {
          size: 2,
          quantity: 3,
        },
        {
          size: 4,
          quantity: 2,
        },
      ],

      order: [
        {
          id: 100,
          size: [1],
        },
        {
          id: 101,
          size: [2],
        },
        {
          id: 102,
          size: [2, 3],
        },
        {
          id: 103,
          size: [1, 2],
        },
        {
          id: 104,
          size: [4],
        },
        {
          id: 105,
          size: [3, 4],
        },
      ],

      isPosible: true,
    },

    {
      store: [
        {
          size: 1,
          quantity: 2,
        },
        {
          size: 2,
          quantity: 2,
        },
        {
          size: 3,
          quantity: 1,
        },
        {
          size: 4,
          quantity: 2,
        },
      ],

      order: [
        {
          id: 100,
          size: [1],
        },

        {
          id: 101,
          size: [1, 2],
        },

        {
          id: 102,
          size: [1, 2],
        },

        {
          id: 103,
          size: [2],
        },

        {
          id: 104,
          size: [2, 3],
        },

        {
          id: 105,
          size: [4],
        },

        {
          id: 106,
          size: [3, 4],
        },
      ],

      isPosible: true,
    },
  ];

  let errors = 0;

  for (const test of tests) {
    try {
      const result = processOrder(test.store, test.order);

      if (!checkOrderProcessingResult(test, result)) {
        errors++;

        console.log("failed for", test);
      }
    } catch (e) {
      errors++;

      console.log("failed for", test, "exception", e.message);
    }
  }

  if (errors === 0) {
    console.log("processOrder test successfuly completed");
  } else {
    console.log(`processOrder test failed with ${errors} errors`);
  }

  console.log("////////////////////////////////////////");

  console.log("////////////////////////////////////////");

  console.log("////////////////////////////////////////");

  console.log("////////////////////////////////////////");
}

function checkOrderProcessingResult(test, result) {
  // console.log('test', test, 'result', result);

  if (!test.isPosible && !result) {
    //
    return true;
  }

  if ((!test.isPosible || !result) && test.isPosible != result) {
    return false;
  }

  compareStatsAndAssigmnet(result);

  compareOrderAndAssigment(test.order, result.assignment);

  compareStoreAndStats(test.store, result.stats);

  return true;
}

function compareStatsAndAssigmnet(result) {
  const { stats, assignment } = result;

  const calcStatsMap = new Map();

  for (const ass of assignment) {
    const m = calcStatsMap.get(ass.size);

    calcStatsMap.set(ass.size, (m || 0) + 1);
  }

  const calcStatsArr = [...calcStatsMap.entries()].sort(
    (e1, e2) => e1[0] - e2[0]
  );

  const orignalStatsArr = [...stats]
    .sort((e1, e2) => e1.size - e2.size)
    .filter((e) => e.quantity > 0);

  if (calcStatsArr.length !== orignalStatsArr.length) {
    throw new Error("stats does not correspond to assignment");
  }
}

function compareOrderAndAssigment(order, assignment) {
  for (const o of order) {
    const ass = assignment.find((a) => a.id == o.id);

    if (!ass) {
      throw new Error(`Cannot find assigment for id=${o.id}`);
    }

    if (!o.size.includes(ass.size)) {
      throw new Error(`Assigned wrong size (${ass.size}) for id=${o.id}`);
    }
  }
}

function compareStoreAndStats(store, stats) {
  for (const statsItem of stats) {
    if (statsItem.quantity === 0) {
      continue;
    }

    const storeItem = store.find((storeI) => storeI.size === statsItem.size);

    if (!statsItem) {
      throw new Error(
        `Cannot find store item for statsItem.size=${statsItem.size}`
      );
    }

    if (storeItem.quantity < statsItem.quantity) {
      throw new Error(
        `store item for size=${storeItem.size} has quantity=${storeItem.quantity} < statsItem.quantity=${statsItem.quantity}`
      );
    }
  }
}
