/*
 * @name  phoneNumberRegex
 * @description
 *  Delete zeros and number +212 or 00 from the phone number
 * @param number [String]
 * @returns  String
*/
export const phoneNumberRegex = number => {
  let patr = /^(00|\+)?(212)/;
  number = number.replace(patr, "0");
  let pattern = /^(00|\+)?(93|27|355|213|49|376|244|1264|1268|599|966|54|374|297|247|61|43|994|1242|973|880|1246|32|501|229|1441|975|375|95|591|387|267|55|673|359|226|257|855|237|1|238|1345|236|56|86|357|57|269|243|242|682|850|82|506|225|385|53|45|246|253|1767|20|971|593|291|34|372|251|298|679|358|33|241|220|995|233|350|30|1473|299|590|1671|502|224|240|245|592|594|509|504|852|36|91|62|964|98|353|354|972|39|1876|81|962|7|254|996|686|965|856|266|371|961|231|218|423|370|352|853|389|261|60|265|960|223|500|356|1670|212|692|596|230|222|262|52|691|373|377|976|382|1664|258|264|674|977|505|227|234|683|47|687|64|968|256|998|92|680|970|507|675|595|31|51|63|48|689|351|974|40|44|250|1869|290|1758|378|508|1784|677|503|685|1684|239|221|381|248|232|65|421|386|252|249|211|94|46|41|597|268|963|992|255|886|235|420|672|66|670|228|690|676|1868|216|993|1649|90|688|380|598|678|39|58|1340|1284|84|681|967|260|263|881)/;
  number = number
    .replace(pattern, "")
    .split("-")
    .join("");
  number = number.split("(").join("");
  number = number.split(")").join("");
  number = number.split(" ").join("");

  return number;
};
/**
 *  Object of colors
 */
export const defaultColors = [
  "#2ecc71", // emerald
  "#3498db", // peter river
  "#8e44ad", // wisteria
  "#e67e22", // carrot
  "#e74c3c", // alizarin
  "#1abc9c", // turquoise
  "#2c3e50" // midnight blue
];

/*
 * @name  sumChars
 * @description
 *  Calculate the number of characters in a string
 * @param str [String]
 * @returns  Int
*/
export const sumChars = str => {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
};

/*
 * @name  groupArrayByFirstChar
 * @description
 *  Grouping an array by the first letter in one of its elements
 * @param arg [Array]
 * @Param  {string}  key [name of property]
 * @returns  Array
 * */
export const groupArrayByFirstChar = (arg, key) => {
  let group;
  let data = arg.reduce((r, e) => {
    let pattern = /[\u0600-\u06FF-\#\d+]/;
    if (e[key] != null && e[key][0] != undefined) {
      if (pattern.test(e[key][0])) {
        group = "#";
      } else {
        group = e[key][0].toUpperCase();
      }
    } else {
      if (pattern.test(e["givenName"][0])) {
        group = "#";
      } else {
        group = e["givenName"][0].toUpperCase();
      }
    }

    if (!r[group]) r[group] = { group, data: [e] };
    else r[group].data.push(e);
    return r;
  }, {});

  let result = Object.values(data);

  return result.sort(alphabetically(true));
};

export const getSectionList = data => {
  let newData = groupArrayByFirstChar(data);
  // Data source of the packet header
  let contactSection = [];
  for (let i = 0; i < newData.length; i++) {
    // Use the scroll bar on the right side
    contactSection[i] = newData[i].group;
  }
  return contactSection;
};

export const getSectionListSize = data => {
  let newData = groupArrayByFirstChar(data);
  // The position of the packet header in the list
  let contactSectionSize = [];
  for (let i = 0; i < newData.length; i++) {
    contactSectionSize[i] = newData[i].data.length;
  }
  return contactSectionSize;
};

/*
 * @name  uniqueList
 * @description
 *  Filter an array based on the phone number and return a new array arranged by the first name
 * @param list [Array]
 * @Param  {string}  key [name of property]
 * @returns  Array
 * */
export const uniqueList = (list, key) => {
  list = list.filter(
    (elm, index, self) =>
      index ===
      self.findIndex(t => {
        if (elm.phoneNumbers[0] != null && t.phoneNumbers[0] != null) {
          return (
            phoneNumberRegex(t.phoneNumbers[0].number) ===
            phoneNumberRegex(elm.phoneNumbers[0].number)
          );
        }
        return false;
      })
  );
  return list.sort((a, b) => {
    if (a[key] && b[key] != null) {
      a[key].toUpperCase().localeCompare(b[key].toUpperCase());
    }
  });
};

/*
 * @name  alphabetically
 * @description
 *  Sort array alphabetically based on group element
 * @param ascending [bool]
 * @returns  Int
 * */
export const alphabetically = ascending => {
  return (a, b) => {
    if (a.group.toUpperCase() === null) {
      return 1;
    } else if (b.group.toUpperCase() === null) {
      return -1;
    }
    if (a.group.toUpperCase() === "#") {
      return 1;
    } else if (b.group.toUpperCase() === "#") {
      return -1;
    } else if (a.group.toUpperCase() === b.group.toUpperCase()) {
      return 0;
    } else if (ascending) {
      return a.group.toUpperCase() < b.group.toUpperCase() ? -1 : 1;
    } else if (!ascending) {
      return a.group.toUpperCase() < b.group.toUpperCase() ? 1 : -1;
    }
  };
};

/*
 * @name  uniqueNumber
 * @description
 *  Filter an array based on the phone number and return a new array
 * @param numbers [Array]
 * @returns  Array
 * */
export const uniqueNumber = numbers => {
  numbers = numbers.filter(
    (elm, index, self) =>
      index ===
      self.findIndex(t => {
        if (elm.number != null && t.number != null) {
          return phoneNumberRegex(t.number) === phoneNumberRegex(elm.number);
        }
        return false;
      })
  );
  return numbers;
};

/*
 * @name  avatarLetter
 * @description
 *  return the first letter from a string
 * @param FullName [String]
 * @returns  String
 * */
export const avatarLetter = FullName => {
  var arregex = /[\u0600-\u06FF]/;
  if (arregex.test(FullName)) {
    FullName = FullName.match(/[\u0600-\u06FF]/g);
    return FullName[0];
  }
  FullName = FullName.match(/\b(\w)/g);
  if (FullName != null) {
    return FullName[0].toUpperCase();
  }
};

/*
 * @name  _contains
 * @description
 *   search from object element
 * @param user [Object]
 * @param query [String]
 * @returns  bool
 * */
export const _contains = (user, query) => {
  if (
    user.givenName !== null &&
    user.givenName !== undefined &&
    user.givenName.toLowerCase().includes(query)
  ) {
    return true;
  } else if (
    user.familyName !== null &&
    user.familyName !== undefined &&
    user.familyName.toLowerCase().includes(query)
  ) {
    return true;
  } else if (
    user.middleName !== null &&
    user.middleName !== undefined &&
    user.middleName.toLowerCase().includes(query)
  ) {
    return true;
  }

  return false;
};
