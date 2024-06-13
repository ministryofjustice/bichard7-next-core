import type { TriggerCode } from "../../types/TriggerCode"

const getGenericTriggerCaseOrOffenceLevelIndicator = (triggerCode: TriggerCode): string => {
  const CASE_OR_OFFENCE_LEVEL_POSITION = 3

  console.log("To be implemented: TriggerBuilderUtilsImpl.java:477", triggerCode)
  return ""
}

// Codes from genericTriggersMapping.properties
// Note some commented out.
// #R5.7 updates
// TRPR0001=pre,Y,B,O,3007,3028,3030,3050,3051,3070,3071,3072,3073,3074,3094,3095,3096
// TRPR0005=pre,N,B,C,4012,4016,4028,4032,4049,4050,4051,4053,4054,4056,4057,4058,4541,4560,4564,4588
// TRPR0006=pre,Y,B,C,1002,1003,1004,1007,1008,1024,1055,1056,1058,1073,1074,1075,1077,1080,1081,1088,1091,1092,1093,1110,1111,1121,1126,1133,3132,3053,1507
// TRPR0007=pre,N,B,C,2065
// TRPR0012=pre,N,B,C,2509
// #TRPR0016=pre,N,R,O,3054,3055,3056,3082,3134,3135,3136,3137,3138
// TRPR0017=pre,N,R,O,2007
// TRPR0019=pre,Y,B,C,4017,4046,4055,4561
// TRPR0021=pre,Y,B,O,3002,3022,3023,3025,3035,3115
// #TRPR0022=pre,Y,B,C,4022
// TRPR0026=pre,Y,B,O,3075,3076

// TRPS0002=post,Y,R,C,3107
// TRPS0008=post,Y,R,O,3105

// #Rel xls.v72
// TRPR0022=pre,Y,B,C,4022,4067,4068

// #Rel xls.v75
// TRPR0016=pre,N,R,O,3055,3056,3134,3135,3136,3137,3138

// #Rel xls.v86
// TRPR0030=pre,N,N,C,PL84504,PL84505,PL84506

export default getGenericTriggerCaseOrOffenceLevelIndicator
