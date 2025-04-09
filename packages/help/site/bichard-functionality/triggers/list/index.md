---
layout: default
title: List of Triggers
id: triggerList
---

| Trigger ID | TRPR0001 |
|------------|----------|
| Trigger description | Driver Disqualification |
| PNC screen to update | Driver Disqualification |
| CJS result code | {::nomarkdown}<ul></li> <li>3028 Disqualification limited to</li><li>3030 Driving license restored with effect from</li><li>3050 Reduced Disqualification from Driving after Completing Course</li><li>3051 Reduced Disqualification from Driving – special reasons or mitigating circumstances</li><li>3070 Disqualified from Driving – Obligatory</li><li>3071 Disqualified from Driving – Discretionary</li><li>3072 Disqualified from Driving – Points (Totting)</li><li>3073 Disqualified from Driving until Ordinary Test Passed</li><li>3074 Disqualified from Driving until Extended Test Passed</li><li>3094 Disqualified from Driving non motoring offence</li><li>3095 Disqualified from Driving – vehicle used in Crime</li><li>3096 Interim Disqualification from Driving</li></ul>{:/} |

| Trigger ID | TRPR0002 |
|------------|----------|
| Trigger description | Warrant issued |
| PNC screen to update | Wanted / Missing |
| CJS result code | {::nomarkdown}<ul><li>4575 Warrant for Offence Backed for Bail (Dated) *</li><li>4576 Warrant for Offence Not Backed for Bail (Undated) *</li><li>4577 Warrant for Offence Backed for Bail (Undated) *</li><li>4585 Warrant for Arrest of Parent / Guardian *</li><li>4586 Warrant for Arrest of Witness *</li><li>*AND Result Qualifier is not 'EO' - Warrant allocated to civilian enforcement officer</li></ul>{:/} |

| Trigger ID | TRPR0003 |
|------------|----------|
| Trigger description | Order issues |
| PNC screen to update | Wanted / Missing |
| CJS result code | {::nomarkdown}<ul><li>1100 Exclusion Order</li><li>1177 Criminal Behaviour Order</li><li>1178 Interim Criminal Behaviour Order</li><li>3034 Order to keep Dog Under Control</li><li>3041 Licensed premises Exclusion Order</li><li>3047 Restraining Order Protection from Harassment</li><li>3068 Football Banning Order</li><li>3078 Travel Restriction Order</li><li>3080 Anti-Social Behaviour Order</li><li>3082 Contingent Destruction Order</li><li>3100 Interim ASBO</li><li>3106 Exclusion Requirement</li><li>3121 Serious Crime Prevention Order</li><li>3122 Interim Violent Offender Order</li><li>3123 Violent Offender Order</li><li>3124 Interim Drinking Banning Order</li><li>3125 Drinking Banning Order</li><li>3133 Foreign Travel Restriction Order</li><li>3284 Interim Slavery and Trafficking Prevention Order</li><li>3285 Slavery and Trafficking Prevention Order</li><li>3326 Domestic Abuse Protection Order (trial)</li><li>4590 Interim Anti-Social Behaviour Order</li><li>OR the offence contains a Youth Rehabilitation Order result (one of 1141, 1142 or 1143) together with a curfew, residence or prohibited activity requirement (one of 3104, 3105 or 3107)</li></ul>{:/} |

| Trigger ID | TRPR0004 |
|------------|----------|
| Trigger description | Convicted of Sexual Offence or Sexual Order made |
| PNC screen to update | Markers and Register(s) as appropriate |
| CJS result code | {::nomarkdown}<ul><li>3052 Sex Offenders Notice</li><li>3081Restraining Order Sexual Offence</li><li>3085 Notification Order – sex offender</li><li>3086 Sexual offences prevention order</li><li>3087 Foreign Travel Order</li><li>3088 Risk of sexual harm order</li><li>3089 Risk of sexual harm order</li><li>3090 Interim sexual offences prevention order</li><li>1179 Sexual Harm Prevention Order</li><li>1181 Interim Sexual Harm Prevention Order</li><li>3281 Interim Sexual Risk Order</li><li>3282 Sexual Risk Order</li><li>3091 Interim Risk of sexual harm order</li><li>OR the verdict is 'Guilty' and the offence code is one of the following: SX56001, SX56005, SX56006, SX56010, SX56013 to SX56015, SX56021 to SX56031, SX56047 to SX56050, IC60005 to IC60008, CL77015, PK78001 to PK78008, CJ88115, SA00001, SA00002, SX03001 to SX03111, SX03123 to SX03137, SX03156 to SX03179, SX03181 to SX03201, SX03208, SX03209, SX03224, SX03225, SX03226, SX03227, SX03228, SX03229, SX03230, SX03231, SX03232, CE79180, CE79161, CD98001, CD98055, CD98056</li><li>OR the result text contains the following words: "sex offender" or "sex offences act"</li></ul>{:/} |

| Trigger ID | TRPR0005 |
|------------|----------|
| Trigger description | Defendant remanded in Custody |
| PNC screen to update | Custody History |
| CJS result code | {::nomarkdown}<ul><li>4012 Remittal for Sentence in Custody</li><li>4016 Commit to Crown Court for Sentence in Custody</li><li>4028 Remand In Custody</li><li>4032 Remittal To Youth Court In Custody</li><li>4049 Remand in Custody after Bail Appeal by Prosecutor</li><li>4050 Remand in Custody to Customs Detention</li><li>4051 Remand in Custody to Hospital (Mental Health Act)</li><li>4053 Mental Health – Commit to Crown Court for Restriction (Remand to prison)</li><li>4054 Committed to Crown Court for Sentence in Youth Detention Accommodation</li><li>4056 Remitted to Youth Court in Youth Detention Accommodation</li><li>4057 Commit/Transfer/Send for Trial to CC in Youth Detention Accommodation</li><li>4058 Remanded in Youth Detention Accommodation</li><li>4541 Remand in Police Custody</li><li>4560 Commit/Transfer/Send to Crown Court for Trial in Custody</li><li>4564 Commit/Transfer/Send to Crown Court for Trial in Custody (Transfer Direction)</li><li>4588 Remittal for Trial – In Custody</li></ul>{:/} |

| Trigger ID | TRPR0006 |
|------------|----------|
| Trigger description | Defendant imprisoned |
| PNC screen to update | Custody History |
| CJS result code | {::nomarkdown}<ul><li>1002 Imprisonment</li><li>1003 Detained during HM Pleasure</li><li>1004 Restriction Order</li><li>1007 Detention</li><li>1008 Hospital Order</li><li>1024 Young Offenders Institution</li><li>1055 Unserved from Original Sentence</li><li>1056 Detained in Place approved by Sec. Of State</li><li>1058 Training School Order (NI)</li><li>1073 Detained without Limit of Time</li><li>1074 Criminal Procedure (Scotland) Act 1975</li><li>1075 Order under Prisoner & Criminal Proceedings (Scotland) Act 1993 s.16</li><li>1077 Youth Custody (Guernsey)</li><li>1080 Secure Training Order</li><li>1081 Detention and Training Order</li><li>1088 Hospital & Limitation Directions</li><li>1091 Detained during Secretary of State's pleasure (NI)</li><li>1092 Young Offenders Centre (NI)</li><li>1093 Juvenile Justice Centre (NI)</li><li>1110 Return to Detention</li><li>1111 Return to Prison</li><li>1121 Indeterminate Sentence Minimum</li><li>1126 One Days Detention</li><li>1133 Return to YOI</li><li>1507 Suspended Sentence Implemented</li><li>3053 Secure Accommodation Order</li><li>3132 Interim Hospital Order</li></ul>{:/} |

| Trigger ID | TRPR0007 |
|------------|----------|
| Trigger description | Defendant Dead |
| PNC screen to update | Death Marker |
| CJS result code | 2065 Death |

| Trigger ID | TRPR0008 |
|------------|----------|
| Trigger description | Defendant has breached bail |
| PNC screen to update | Breach of bail marker |
| CJS result code | The defendant is guilty of one of the following offences: BA76004, BA76005 |

| Trigger ID | TRPR0010 |
|------------|----------|
| Trigger description | Bail conditions imposed/varied/ cancelled |
| PNC screen to update | Remand Screen |
| CJS result code | {::nomarkdown}<ul><li>Bail conditions are present on the case – as held in the Bail Condition field(s) on the Defendant tab within the Portal</li><li>OR 4597 Police bail variation</li><li>OR a result on the case contains the LI (bail conditions cancelled) qualifier</li></ul>{:/} |

| Trigger ID | TRPR0012 |
|------------|----------|
| Trigger description | Warrant not executed / Withdrawn |
| PNC screen to update | Wanted / Missing |
| CJS result code | 2509 Warrant not executed |

| Trigger ID | TRPR0015 |
|------------|----------|
| Trigger description | Personal details changed |
| PNC screen to update | Personal details |
| CJS result code | 4592 Defendant's personal details changed |

| Trigger ID | TRPR0016 |
|------------|----------|
| Trigger description | Forfeiture order made |
| PNC screen to update | Destruction register |
| CJS result code | {::nomarkdown}<ul><li>3055 Deprivation</li><li>3056 Confiscation</li><li>3134 Forfeiture of cash</li><li>3135 Forfeiture and destruction</li><li>3136 Forfeiture of license</li><li>3137 Forfeiture and sale</li><li>3138 Forfeiture of vehicle</li></ul>{:/} |

| Trigger ID | TRPR0017 |
|------------|----------|
| Trigger description | Adjourned Sine Die |
| PNC screen to update | Update case details |
| CJS result code | 2007 Adjourned Sine Die |

| Trigger ID | TRPR0018 |
|------------|----------|
| Trigger description | Update offence dates on PNC |
| PNC screen to update | Offence dates |
| CJS result code | Offence date range from court falls within date range on PNC, but is not an exact match |

| Trigger ID | TRPR0019 |
|------------|----------|
| Trigger description | Remanded in custody with bail direction |
| PNC screen to update | Bail screen |
| CJS result code | {::nomarkdown}<ul><li>4017 Commit to Crown Court for sentence in custody with bail direction</li><li>4046 Remand in custody with direction to release on bail</li><li>4055 Remand In Youth Detention Accommodation With Bail Direction</li><li>4561 Commit/Transfer/Send to Crown Court for Trial in custody with direction to release on bail</li></ul>{:/} |

| Trigger ID | TRPR0020 |
|------------|----------|
| Trigger description | Breach offence |
| PNC screen to update | Update original case with conviction and sentence details |
| CJS result code | {::nomarkdown}<ul><li>1029 Order Revoked</li><li>1030 Order Varied</li><li>1031 Order Extended</li><li>1032 Order Amended</li><li>3501 Dealt with for Original Offence</li><li>OR The defendant is being sentenced for one of the following offences:<br>CD98001, CD98019, CD98020, CD98021, CD98058, CJ03506, CJ03507, CJ03510, CJ03511, CJ03522, CJ03523, CJ08507, CJ08512, CJ08519, CJ08521, CJ08526, CJ91001, CJ91002, CJ91028, CJ91029, CJ91031, CJ91039, CS97001, FB89004, LP80001, MC80002, MC80508, MC80601, PC00003, PC00004, PC00005, PC00006, PC00007, PC00008, PC00009, PC00010, PC00501, PC00502, PC00504, PC00505, PC00515, PC00525, PC00535, PC00545, PC00555, PC00565, PC00575, PC00585, PC00595, PC00605, PC00615, PC00625, PC00635, PC00645, PC00655, PC00665, PC00700, PC00702, PC73003, PU86051, PU86089, PU86118, SC07001, SO59501, SX03202, SX03220, SX03221, SX03222, SX03223</li></ul>{:/} |

| Trigger ID | TRPR0021 |
|------------|----------|
| Trigger description | Disqualification or Revocation Order made (not motoring) |
| PNC screen to update | Relevant 'Order' screen |
| CJS result code | {::nomarkdown}<ul><li>3002 Disqualified from being Company Director</li><li>3022 Disqualified from keeping a dog</li><li>3023 Disqualified from Having Custody of a Dog</li><li>3025 Disqualified from keeping animal</li><li>3035 Firearm certificate revoked</li><li>3115 Disqualification relating to animals</li></ul>{:/} |

| Trigger ID | TRPR0022 |
|------------|----------|
| Trigger description | Extradition ordered or Proceedings pending |
| PNC screen to update | Invoke local processes |
| CJS result code | {::nomarkdown}<ul><li>4022 Extradited</li><li>4067 Extradition ordered</li><li>4068 Extradition proceedings pending</li></ul>{:/} |

| Trigger ID | TRPR0023 |
|------------|----------|
| Trigger description | Domestic Violence Case |
| PNC screen to update | Invoke local processes |
| CJS result code | Result Qualifier LG (an option under the "Urgent" result in Libra) |

| Trigger ID | TRPR0024 |
|------------|----------|
| Trigger description | Vulnerable or Intimidated victim/witness |
| PNC screen to update | Invoke local processes |
| CJS result code | Result Qualifier LH (an option under the "Urgent" result in Libra) |

| Trigger ID | TRPR0025 |
|------------|----------|
| Trigger description | Original Case Reopened/stat dec made |
| PNC screen to update | Update original case with conviction and sentence details |
| CJS result code | {::nomarkdown}<ul><li>Offence code MC80524 together with Result Code 4584</li><li>OR Offence code MC80527 together with Result Code 3049</li></ul>{:/} |

| Trigger ID | TRPR0026 |
|------------|----------|
| Trigger description | Driving disqualification suspended |
| PNC screen to update | Driver Disqualification |
| CJS result code | {::nomarkdown}<ul><li>3075 Driving Disqualification Suspended Pending Appeal on Imposition</li><li>3076 Driving Disqualification Suspended Pending Appeal Subsequent to Imposition</li></ul>{:/} |

| Trigger ID | TRPR0027 |
|------------|----------|
| Trigger description | Out of Area case |
| PNC screen to update | Will depend on what action is required on the case |
| CJS result code | This trigger will fire for cases which are heard outside a force's area. It will fire for cases which meet the conditions for any trigger which the force does not take. |

| Trigger ID | TRPR0028 |
|------------|----------|
| Trigger description | Trigger only case reallocated from another force |
| PNC screen to update | The case will need to be reviewed to see what action is required. |
| CJS result code | This trigger will fire when a case is reallocated to another force. Its purpose is to inform the receiving force that a case has been reallocated to them, and that case does not contain exceptions but contains triggers that the new force does not have enabled. |

| Trigger ID | TRPR0029 |
|------------|----------|
| Trigger description | Civil proceedings granted or Order made – update records as appropriate |
| PNC screen to update | The case will need to be reviewed to see what action is required. |
| CJS result code | This trigger is raised if the case is non-recordable and contains one of the following offences:{::nomarkdown}<br>{:/}AS14504, AS14509, AS14511, CD98501, CD98502, CD98503, CD98517, CD98519, CD98525, CJ08503, CJ08504, CJ08505, CS10501, CS10502, FB89501, FB89506, MC80530, MS15501, MS15502, MS15503, MS15504, PC00503, PC00506, PC09504, PC09505, PC09510, PH97503, SE20503, SE20505, SE20506, SE20513, SE20529, SE20541, SE20545, ST19501{::nomarkdown}<br>{:/}OR{::nomarkdown}<br>{:/}The case is non-recordable and contains one of the following offences and the application has been granted [Note: the word 'granted' must appear within the result text received from Libra]:{::nomarkdown}<br>{:/} AS14501, AS14502, AS14503, AS14505, AS14506, AS14507, AS14508, AS14510, AS14512,AS14513, AW06502, CC81501, CD98510, CD98516, CD98518, CD98527, CD98528, CJ03509,CJ03513, CJ03519, CJ03520, CJ08506, CJ08508, CJ08522, FB89502, FB89503, MC80515,PC09501, PC09502, PC09503, PC09506, PC09507, PC09508, PC09509, PC09511, PH97501,PH97502, PL84503, RO88504, RO88505, ST19502, ST19503, ST19504, ST19505, ST19506,ST19507, SX03505, SX03506, SX03507, SX03508, SX03509, SX03510, SX03511, SX03512,SX03513, SX03514, SX03515, SX03516, SX03517, SX03518, SX03519, SX03520, SX03521,SX03522, SX03523, SX03524, SX03525, SX03526, SX03527, SX03528, SX03529, SX03530,SX03531, SX03532, SX03540, SX03541, SX03542, SX03543, SX03544, SX03545, SX03546,SX03547, SX03548, SX03549, TR08500, TR08501, TR08502, TR08503, VC06501, VC06502,VC06503, VC06504, VC06505, YJ99501, YJ99503 |

| Trigger ID | TRPR0030 |
|------------|----------|
| Trigger description | Pre-charge bail application |
| PNC screen to update | Will depend on what action is required on the case |
| CJS result code | The case contains one of the following application offence codes: PL84504, PL84505, PL84506 |

| Trigger ID | TRPS0002 |
|------------|----------|
| Trigger description | Confirm address on PNC |
| PNC screen to update | Confirm address |
| CJS result code | 3107 Residence Requirement |

| Trigger ID | TRPS0003 |
|------------|----------|
| Trigger description | Disposal Text too long – revise on PNC if wanted |
| PNC screen to update | Update text |
| CJS result code | Text associated with result is greater than 64 characters (PNC disposal text field size). PNC updated by Bichard 7 with first 63 characters and a '+' to indicate some text is missing. |

| Trigger ID | TRPS0004 |
|------------|----------|
| Trigger description | Split Adjournment – manual split required |
| PNC screen to update | Manually split the result |
| CJS result code | More than 1 adjournment for a case. |

| Trigger ID | TRPS0008 |
|------------|----------|
| Trigger description | Curfew Order |
| PNC screen to update | Details of curfew order |
| CJS result code | 3105 Curfew Requirement |

| Trigger ID | TRPS0010 |
|------------|----------|
| Trigger description | Offence added to the PNC |
| PNC screen to update | MO Screen/ Offence Location |
| CJS result code | Criminal offence added in court and the Bichard 7 / PNC interface allows the offence to be added to the PNC |

| Trigger ID | TRPS0011 |
|------------|----------|
| Trigger description | Offence added in court – not added to the PNC |
| PNC screen to update | Add Offence |
| CJS result code | Criminal offence added in court but the Bichard 7 / PNC interface does not allow the offence to be added to the PNC |

| Trigger ID | TRPS0013 |
|------------|----------|
| Trigger description | Offences taken into consideration – add to offence |
| PNC screen to update | Add TICs to offence |
| CJS result code | Offences taken into consideration added by the court but the Bichard 7 / PNC interface does not allow them to be added to the PNC |
