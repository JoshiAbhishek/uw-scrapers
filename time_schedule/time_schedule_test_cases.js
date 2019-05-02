"use strict";

// Test cases for UW Time Schedule course information
var testCases = [
    `Restr  12866 I  1-3     to be arranged                  Ceze,Luis H                Open      4/  10  CR/NC
                        ==============================

                        MOLECULAR INFORMATION SYSTEMS

                        LAB GROUP MEETING

                        =============================`,
    `      >12869 L  1-3     to be arranged                                                       0/  10  CR/NC
                        ===============================

                        SATELLITE IMAGE ANALYSIS GROUP

                        ---------------------------

                        MEETING TIME: BIWEEKLY WEDNESDAYS,

                        12:30-1:30PM

                        1 CREDIT

                        ===============================`,
    `      >12870 M  1-3     to be arranged                  Fogarty,James A                      0/  20  CR/NC
                        TBA`,
    `Restr  12874 Q  1-3     to be arranged                                             Open      0/  15  CR/NC`,
    `Restr  12877 T  1-3     to be arranged                                             Open      2/  10  CR/NC
                        LANGUAGE, INTERACTION, AND LEARNING`,
    `Restr  12880 W  1-3     to be arranged                  Lin,Huijia                 Open      4/  20  CR/NC
                        ===========================

                        CRYPTOGRAPHY READING GROUP

                        --------------------------

                        MEETS MON 10:00-11:50 AM

                        IN ROOM CSE2 387 (GATES CENTER)

                        ===========================`,
    `       21870 A  1-5     MTWThF 430-720P   CSE2 G01                                 Open      0/ 100  CR/NC`,
    `Restr  21412 D1 4       WF     130-250    ECE  042      Hajishirzi,Hanna           Closed   33/  30
                        ===================================

                        REPRESENTATION AND REASONING IN NLP

                        ===================================`,
    `      >12886 Q  4       MWF    1230-120   *    *                                             0/  10
                        TBA`,
    `       21934 QB  QZ     to be arranged    *    *                                   Open      0/   5                J`,
    `      >12891 Z  1-5     MTWThF 530-820P   ECE  125                                           0/ 140`,
    `IS   >12895 A  1-10    to be arranged                                                      63/  50E CR/NC`,
    `IS    15404 B  1-5     to be arranged                                             Open     13/  35  CR/NC               
                               INFO 499 FORMS AVAILABLE ONLINE AT:                                                                                                                 
                               HTTP://ISCHOOL.UW.EDU/INFO-EXP AT                                                                                                                   
                               BOTTOM OF PAGE. COMPLETE WITH                                                                                                                       
                               INSTRUCTOR'S SIGNATURES, SUBMIT TO                                                                                                                  
                               MGH 420 FOR APPROVAL.`,
    `Restr  13423 A  4       T      330-450    SAV  131      Zivot,Eric L.                Open     24/  35  $62
                        Th     500-620P   SIG  227      Park,Hyeonseok
                        F      230-320    SAV  131
                        PREREQ: ECON 581`,
    `IS   >12895 A  1-10    to be arranged                                                      63/  50E CR/NC`,
    `IS   >12895 A  1-10    to be arranged                                                      63/  50E  CR/NC  $35`,
    `Restr  17665 A  4       MWF    930-1020   HST  T635     Phillips,Paul Edward Mack  Open     15/  35                      
                        Th     830-1020   HST  T478     Phillips,Paul Edward Mack
                        INSTRUCTOR APPROVAL NEEDED FOR                                                                                                                      
                        NON-NEURO STUDENTS`,
    `Restr  17666 A   .5     M      330-450    HSD  D209     De La Iglesia,Horacio O.   Open     18/  60  CR/NC               
                        ADD CODES AVAILABLE FROM                                                                                                                            
                        NEUROSCIENCE PROGRAM OFFICE.`,
    `Restr  17670 A  4       to be arranged                  De La Iglesia,Horacio O.   Open      9/  20  CR/NC `,
    `Restr  13072 A  6       to be arranged    *             Greene,Rachel E            Open      6/  10E               J`,
    `Restr  13077 A  1       to be arranged    *             Gordon,Sara C              Closed   64/  64E CR/NC         J  `,
    `Restr  13073 A  3       MTWThF 730-920    HSD  D209     Gordon,Sara C              Open     64/  64E         $420  J     
                        COURSE BEGINS APRIL 1 AND ENDS MAY                                                                                                                  
                        31.`,
    `13469 A  3       MW     930-1050   *             Bradley,Shannon Niev Tice  Open     12/  30E CR/NC               
                        FOR STUDENTS IN THE                                                                                                                                 
                        RESIDENT ADVISOR                                                                                                                                    
                        SELECTION PROCESS.`,
    `>13500 A  3-4     T      430-650P   SAV  137      Lott                                14/  30                      
                        LHE STUDENTS MUST REGISTER FOR 4                                                                                                                    
                        CREDIT HOURS. OTHER STUDENTS IN                                                                                                                     
                        THE COURSE MAY REGISTER FOR 3 OR                                                                                                                    
                        4 CREDITS.                                                                                                                                          
                        FOR PERIOD 3 ADD CODE                                                                                                                               
                        EMAIL EDCODES@UW.EDU FOR ADD                                                                                                                        
                        CODE;                                                                                                                                               
                        INCLUDE NAME, STUDENT ID NUMBER,                                                                                                                    
                        COURSE TITLE, NUMBER & SLN.`,
    `>19599 A  1-5     to be arranged                  Ganti,Anjulie                        5/  10E CR/NC               
                        to be arranged                  Ganti,Anjulie
                        PH-GH MAJORS ONLY                                                                                                                                   
                        SEE WEBSITE FOR PROCESS:                                                                                                                            
                        HTTP://SPH.WASHINGTON.EDU/UPH/EXPER                                                                                                                 
                        IENTIAL/INTERNSHIP.ASP`,
    `>19587 A  1       Sat.   1000-350   SOCC 221      Bostock,Tara                        44/  55  CR/NC               
                        W      600-750P   SOCC 303      Bagheri Garakani,Omid
                        CREDIT/NO CREDIT                                                                                                                                    
                        ADD CODE REQUIRED PERIOD 3 (BEGINNI                                                                                                                 
                        NG 4/1/2019)                                                                                                                                        
                        PH-GH MAJORS ONLY SAT, 4/6 FROM 10:                                                                                                                 
                        00 AM - 3:50 PM AND                                                                                                                                 
                        WED, 4/10 & WED, 4/24 FROM 6:00 PM                                                                                                                  
                        - 7:50 PM ONLY.                                                                                                                                     
                        NO OVERLOADS.                                                                                                                                       
                        THOSE WHO DO                                                                                                                                        
                        NOT ATTEND FIRST SESSION WILL BE                                                                                                                    
                        DROPPED. `,
    `16450 A   .5     to be arranged                                             Open      1/  30  CR/NC`,
    `18250 AA  LB     Th     930-1120   HST  T482     Mike,Leigh Ann             Closed   28/  27                      
                        Th     930-1120   HST  T-480    
                        STUDENTS ALTERNATE IN ROOM TBA`,
    `IS   >15855 Y  3       to be arranged                                                       0/  10E CR/NC  $2730        
                        HEALTH LLM SECTION `,
    `       13601 B  1       to be arranged                  Hardison-Stevens,Ph.D, Daw Open     22/  30  CR/NC         %`
];

function getTestCases() {
    return testCases;
}

module.exports = {
    getTestCases
};