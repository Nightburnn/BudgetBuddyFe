import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config/api';
import { useAuth } from '../../../../Auth/AuthContext';
import './style/BudgetSummaryCards.css';



const TotalBudgetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <g clipPath="url(#clip0_82_859)">
    <path d="M21.1875 8.75732C21.15 8.66357 21.1106 8.56982 21.0703 8.47607C20.4654 7.0811 19.4865 5.8806 18.2419 5.00732H20.25C20.4489 5.00732 20.6397 4.92831 20.7803 4.78765C20.921 4.647 21 4.45624 21 4.25732C21 4.05841 20.921 3.86765 20.7803 3.72699C20.6397 3.58634 20.4489 3.50732 20.25 3.50732H10.5C8.42634 3.50996 6.42951 4.29234 4.90601 5.69913C3.38252 7.10591 2.4438 9.03419 2.27625 11.1011C1.6284 11.2621 1.05277 11.6346 0.640489 12.1597C0.228203 12.6847 0.00281392 13.3323 0 13.9998C0 14.1987 0.0790176 14.3895 0.21967 14.5302C0.360322 14.6708 0.551088 14.7498 0.75 14.7498C0.948912 14.7498 1.13968 14.6708 1.28033 14.5302C1.42098 14.3895 1.5 14.1987 1.5 13.9998C1.50017 13.7263 1.57512 13.4581 1.71673 13.2241C1.85834 12.9901 2.06122 12.7993 2.30344 12.6723C2.49012 14.355 3.19176 15.939 4.3125 17.2079L5.49 20.5042C5.5941 20.7958 5.78586 21.048 6.03898 21.2262C6.29209 21.4045 6.59416 21.5 6.90375 21.4998H8.09625C8.40568 21.4999 8.70754 21.4042 8.96047 21.226C9.2134 21.0477 9.40502 20.7956 9.50906 20.5042L9.68906 19.9998H15.0609L15.2409 20.5042C15.345 20.7956 15.5366 21.0477 15.7895 21.226C16.0425 21.4042 16.3443 21.4999 16.6537 21.4998H17.8463C18.1557 21.4999 18.4575 21.4042 18.7105 21.226C18.9634 21.0477 19.155 20.7956 19.2591 20.5042L20.7787 16.2498H21C21.5967 16.2498 22.169 16.0128 22.591 15.5908C23.0129 15.1689 23.25 14.5966 23.25 13.9998V10.9998C23.2501 10.4355 23.0381 9.89173 22.6561 9.47636C22.274 9.06099 21.7499 8.80435 21.1875 8.75732ZM14.25 7.24982H10.5C10.3011 7.24982 10.1103 7.17081 9.96967 7.03015C9.82902 6.8895 9.75 6.69874 9.75 6.49982C9.75 6.30091 9.82902 6.11015 9.96967 5.96949C10.1103 5.82884 10.3011 5.74982 10.5 5.74982H14.25C14.4489 5.74982 14.6397 5.82884 14.7803 5.96949C14.921 6.11015 15 6.30091 15 6.49982C15 6.69874 14.921 6.8895 14.7803 7.03015C14.6397 7.17081 14.4489 7.24982 14.25 7.24982ZM16.875 12.4998C16.6525 12.4998 16.435 12.4338 16.25 12.3102C16.065 12.1866 15.9208 12.0109 15.8356 11.8053C15.7505 11.5998 15.7282 11.3736 15.7716 11.1553C15.815 10.9371 15.9222 10.7367 16.0795 10.5793C16.2368 10.422 16.4373 10.3148 16.6555 10.2714C16.8738 10.228 17.1 10.2503 17.3055 10.3355C17.5111 10.4206 17.6868 10.5648 17.8104 10.7498C17.934 10.9348 18 11.1523 18 11.3748C18 11.6732 17.8815 11.9593 17.6705 12.1703C17.4595 12.3813 17.1734 12.4998 16.875 12.4998Z" fill="#97E0F7"/>
  </g>
  <defs>
    <clipPath id="clip0_82_859">
      <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
  </defs>
</svg>
);



const PendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <g clipPath="url(#clip0_77_1665)">
    <path d="M18.6667 11.375C18.6667 11.5975 18.6008 11.815 18.4772 12C18.3535 12.185 18.1778 12.3292 17.9723 12.4144C17.7667 12.4995 17.5405 12.5218 17.3223 12.4784C17.104 12.435 16.9036 12.3278 16.7463 12.1705C16.5889 12.0132 16.4818 11.8127 16.4384 11.5945C16.395 11.3762 16.4172 11.15 16.5024 10.9445C16.5875 10.7389 16.7317 10.5632 16.9167 10.4396C17.1017 10.316 17.3192 10.25 17.5417 10.25C17.8401 10.25 18.1263 10.3685 18.3372 10.5795C18.5482 10.7905 18.6667 11.0766 18.6667 11.375ZM14.9167 6.5H11.1667C10.9678 6.5 10.7771 6.57902 10.6364 6.71967C10.4958 6.86032 10.4167 7.05109 10.4167 7.25C10.4167 7.44891 10.4958 7.63968 10.6364 7.78033C10.7771 7.92098 10.9678 8 11.1667 8H14.9167C15.1157 8 15.3064 7.92098 15.4471 7.78033C15.5877 7.63968 15.6667 7.44891 15.6667 7.25C15.6667 7.05109 15.5877 6.86032 15.4471 6.71967C15.3064 6.57902 15.1157 6.5 14.9167 6.5ZM23.9167 11V14C23.9167 14.5967 23.6797 15.169 23.2577 15.591C22.8358 16.0129 22.2635 16.25 21.6667 16.25H21.4455L19.9258 20.5044C19.8218 20.7958 19.6301 21.0479 19.3772 21.2261C19.1243 21.4044 18.8224 21.5 18.513 21.5H17.3205C17.0111 21.5 16.7092 21.4044 16.4563 21.2261C16.2034 21.0479 16.0117 20.7958 15.9077 20.5044L15.7277 20H10.3558L10.1758 20.5044C10.0718 20.7958 9.88015 21.0479 9.62722 21.2261C9.37429 21.4044 9.07242 21.5 8.763 21.5H7.5705C7.26107 21.5 6.95921 21.4044 6.70628 21.2261C6.45335 21.0479 6.26173 20.7958 6.15769 20.5044L4.97925 17.2081C3.85817 15.9393 3.1562 14.3553 2.96925 12.6725C2.72721 12.7996 2.52451 12.9905 2.38308 13.2245C2.24164 13.4584 2.16683 13.7266 2.16675 14C2.16675 14.1989 2.08773 14.3897 1.94708 14.5303C1.80643 14.671 1.61566 14.75 1.41675 14.75C1.21784 14.75 1.02707 14.671 0.886418 14.5303C0.745766 14.3897 0.666748 14.1989 0.666748 14C0.667894 13.3312 0.892519 12.6819 1.30494 12.1553C1.71735 11.6287 2.29391 11.2551 2.943 11.0938C3.11055 9.02687 4.04927 7.09859 5.57276 5.6918C7.09626 4.28502 9.09309 3.50263 11.1667 3.5H20.9167C21.1157 3.5 21.3064 3.57902 21.4471 3.71967C21.5877 3.86032 21.6667 4.05109 21.6667 4.25C21.6667 4.44891 21.5877 4.63968 21.4471 4.78033C21.3064 4.92098 21.1157 5 20.9167 5H18.9114C20.1561 5.87328 21.135 7.07378 21.7399 8.46875C21.7802 8.5625 21.8196 8.65625 21.8571 8.75C22.4202 8.7978 22.9448 9.0558 23.3264 9.47268C23.708 9.88957 23.9188 10.4348 23.9167 11ZM22.4167 11C22.4167 10.8011 22.3377 10.6103 22.1971 10.4697C22.0564 10.329 21.8657 10.25 21.6667 10.25H21.3236C21.1639 10.2502 21.0083 10.1993 20.8794 10.1049C20.7506 10.0105 20.6553 9.87738 20.6074 9.725C20.1777 8.35375 19.321 7.15571 18.1624 6.3057C17.0037 5.45569 15.6037 4.99821 14.1667 5H11.1667C9.8568 4.99993 8.57513 5.38103 7.47803 6.09682C6.38093 6.81261 5.51582 7.83217 4.98818 9.03115C4.46054 10.2301 4.29318 11.5568 4.5065 12.8492C4.71982 14.1417 5.30461 15.3442 6.18956 16.31C6.25723 16.3836 6.30951 16.47 6.34331 16.5641L7.5705 20H8.763L9.12112 18.9978C9.17312 18.8522 9.26886 18.7262 9.39523 18.6371C9.5216 18.548 9.67243 18.5001 9.82706 18.5H16.2564C16.4111 18.5001 16.5619 18.548 16.6883 18.6371C16.8146 18.7262 16.9104 18.8522 16.9624 18.9978L17.3205 20H18.513L20.2108 15.2478C20.2628 15.1022 20.3585 14.9762 20.4849 14.8871C20.6113 14.798 20.7621 14.7501 20.9167 14.75H21.6667C21.8657 14.75 22.0564 14.671 22.1971 14.5303C22.3377 14.3897 22.4167 14.1989 22.4167 14V11Z" fill="#FFC107"/>
  </g>
  <defs>
    <clipPath id="clip0_77_1665">
      <rect width="24" height="24" fill="white" transform="translate(0.666748 0.5)"/>
    </clipPath>
  </defs>
</svg>
);

const ApprovedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <g clipPath="url(#clip0_77_1659)">
    <path d="M18.3334 11.375C18.3334 11.5975 18.2674 11.815 18.1438 12C18.0202 12.185 17.8445 12.3292 17.6389 12.4144C17.4333 12.4995 17.2071 12.5218 16.9889 12.4784C16.7707 12.435 16.5702 12.3278 16.4129 12.1705C16.2555 12.0132 16.1484 11.8127 16.105 11.5945C16.0616 11.3762 16.0839 11.15 16.169 10.9445C16.2542 10.7389 16.3984 10.5632 16.5834 10.4396C16.7684 10.316 16.9859 10.25 17.2084 10.25C17.5067 10.25 17.7929 10.3685 18.0039 10.5795C18.2148 10.7905 18.3334 11.0766 18.3334 11.375ZM14.5834 6.5H10.8334C10.6345 6.5 10.4437 6.57902 10.303 6.71967C10.1624 6.86032 10.0834 7.05109 10.0834 7.25C10.0834 7.44891 10.1624 7.63968 10.303 7.78033C10.4437 7.92098 10.6345 8 10.8334 8H14.5834C14.7823 8 14.9731 7.92098 15.1137 7.78033C15.2544 7.63968 15.3334 7.44891 15.3334 7.25C15.3334 7.05109 15.2544 6.86032 15.1137 6.71967C14.9731 6.57902 14.7823 6.5 14.5834 6.5ZM23.5834 11V14C23.5834 14.5967 23.3463 15.169 22.9244 15.591C22.5024 16.0129 21.9301 16.25 21.3334 16.25H21.1121L19.5924 20.5044C19.4884 20.7958 19.2968 21.0479 19.0438 21.2261C18.7909 21.4044 18.4891 21.5 18.1796 21.5H16.9871C16.6777 21.5 16.3758 21.4044 16.1229 21.2261C15.87 21.0479 15.6784 20.7958 15.5743 20.5044L15.3943 20H10.0224L9.84244 20.5044C9.73839 20.7958 9.54677 21.0479 9.29384 21.2261C9.04091 21.4044 8.73905 21.5 8.42962 21.5H7.23712C6.9277 21.5 6.62584 21.4044 6.37291 21.2261C6.11998 21.0479 5.92836 20.7958 5.82431 20.5044L4.64587 17.2081C3.52479 15.9393 2.82282 14.3553 2.63587 12.6725C2.39383 12.7996 2.19114 12.9905 2.0497 13.2245C1.90826 13.4584 1.83346 13.7266 1.83337 14C1.83337 14.1989 1.75436 14.3897 1.6137 14.5303C1.47305 14.671 1.28229 14.75 1.08337 14.75C0.884462 14.75 0.693696 14.671 0.553044 14.5303C0.412392 14.3897 0.333374 14.1989 0.333374 14C0.33452 13.3312 0.559145 12.6819 0.971562 12.1553C1.38398 11.6287 1.96053 11.2551 2.60962 11.0938C2.77717 9.02687 3.71589 7.09859 5.23939 5.6918C6.76288 4.28502 8.75972 3.50263 10.8334 3.5H20.5834C20.7823 3.5 20.9731 3.57902 21.1137 3.71967C21.2544 3.86032 21.3334 4.05109 21.3334 4.25C21.3334 4.44891 21.2544 4.63968 21.1137 4.78033C20.9731 4.92098 20.7823 5 20.5834 5H18.5781C19.8227 5.87328 20.8016 7.07378 21.4065 8.46875C21.4468 8.5625 21.4862 8.65625 21.5237 8.75C22.0868 8.7978 22.6114 9.0558 22.993 9.47268C23.3746 9.88957 23.5854 10.4348 23.5834 11ZM22.0834 11C22.0834 10.8011 22.0044 10.6103 21.8637 10.4697C21.7231 10.329 21.5323 10.25 21.3334 10.25H20.9902C20.8305 10.2502 20.6749 10.1993 20.5461 10.1049C20.4172 10.0105 20.3219 9.87738 20.274 9.725C19.8443 8.35375 18.9876 7.15571 17.829 6.3057C16.6703 5.45569 15.2704 4.99821 13.8334 5H10.8334C9.52342 4.99993 8.24175 5.38103 7.14466 6.09682C6.04756 6.81261 5.18244 7.83217 4.65481 9.03115C4.12717 10.2301 3.9598 11.5568 4.17313 12.8492C4.38645 14.1417 4.97124 15.3442 5.85619 16.31C5.92386 16.3836 5.97613 16.47 6.00994 16.5641L7.23712 20H8.42962L8.78775 18.9978C8.83974 18.8522 8.93548 18.7262 9.06185 18.6371C9.18823 18.548 9.33905 18.5001 9.49369 18.5H15.9231C16.0777 18.5001 16.2285 18.548 16.3549 18.6371C16.4813 18.7262 16.577 18.8522 16.629 18.9978L16.9871 20H18.1796L19.8774 15.2478C19.9294 15.1022 20.0252 14.9762 20.1515 14.8871C20.2779 14.798 20.4287 14.7501 20.5834 14.75H21.3334C21.5323 14.75 21.7231 14.671 21.8637 14.5303C22.0044 14.3897 22.0834 14.1989 22.0834 14V11Z" fill="#4CAF50"/>
  </g>
  <defs>
    <clipPath id="clip0_77_1659">
      <rect width="24" height="24" fill="white" transform="translate(0.333374 0.5)"/>
    </clipPath>
  </defs>
</svg>
);

const RejectedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <path d="M18 11.375C18 11.5975 17.934 11.815 17.8104 12C17.6868 12.185 17.5111 12.3292 17.3055 12.4144C17.1 12.4995 16.8738 12.5218 16.6555 12.4784C16.4373 12.435 16.2368 12.3278 16.0795 12.1705C15.9222 12.0132 15.815 11.8127 15.7716 11.5945C15.7282 11.3762 15.7505 11.15 15.8356 10.9445C15.9208 10.7389 16.065 10.5632 16.25 10.4396C16.435 10.316 16.6525 10.25 16.875 10.25C17.1734 10.25 17.4595 10.3685 17.6705 10.5795C17.8815 10.7905 18 11.0766 18 11.375ZM14.25 6.5H10.5C10.3011 6.5 10.1103 6.57902 9.96967 6.71967C9.82902 6.86032 9.75 7.05109 9.75 7.25C9.75 7.44891 9.82902 7.63968 9.96967 7.78033C10.1103 7.92098 10.3011 8 10.5 8H14.25C14.4489 8 14.6397 7.92098 14.7803 7.78033C14.921 7.63968 15 7.44891 15 7.25C15 7.05109 14.921 6.86032 14.7803 6.71967C14.6397 6.57902 14.4489 6.5 14.25 6.5ZM23.25 11V14C23.25 14.5967 23.0129 15.169 22.591 15.591C22.169 16.0129 21.5967 16.25 21 16.25H20.7788L19.2591 20.5044C19.155 20.7958 18.9634 21.0479 18.7105 21.2261C18.4575 21.4044 18.1557 21.5 17.8463 21.5H16.6538C16.3443 21.5 16.0425 21.4044 15.7895 21.2261C15.5366 21.0479 15.345 20.7958 15.2409 20.5044L15.0609 20H9.68906L9.50906 20.5044C9.40502 20.7958 9.2134 21.0479 8.96047 21.2261C8.70754 21.4044 8.40568 21.5 8.09625 21.5H6.90375C6.59433 21.5 6.29246 21.4044 6.03953 21.2261C5.7866 21.0479 5.59498 20.7958 5.49094 20.5044L4.3125 17.2081C3.19142 15.9393 2.48945 14.3553 2.3025 12.6725C2.06046 12.7996 1.85777 12.9905 1.71633 13.2245C1.57489 13.4584 1.50009 13.7266 1.5 14C1.5 14.1989 1.42098 14.3897 1.28033 14.5303C1.13968 14.671 0.948912 14.75 0.75 14.75C0.551088 14.75 0.360322 14.671 0.21967 14.5303C0.0790176 14.3897 0 14.1989 0 14C0.00114598 13.3312 0.225771 12.6819 0.638188 12.1553C1.05061 11.6287 1.62716 11.2551 2.27625 11.0938C2.4438 9.02687 3.38252 7.09859 4.90601 5.6918C6.42951 4.28502 8.42634 3.50263 10.5 3.5H20.25C20.4489 3.5 20.6397 3.57902 20.7803 3.71967C20.921 3.86032 21 4.05109 21 4.25C21 4.44891 20.921 4.63968 20.7803 4.78033C20.6397 4.92098 20.4489 5 20.25 5H18.2447C19.4894 5.87328 20.4683 7.07378 21.0731 8.46875C21.1134 8.5625 21.1528 8.65625 21.1903 8.75C21.7535 8.7978 22.278 9.0558 22.6596 9.47268C23.0413 9.88957 23.252 10.4348 23.25 11ZM21.75 11C21.75 10.8011 21.671 10.6103 21.5303 10.4697C21.3897 10.329 21.1989 10.25 21 10.25H20.6569C20.4971 10.2502 20.3415 10.1993 20.2127 10.1049C20.0839 10.0105 19.9885 9.87738 19.9406 9.725C19.5109 8.35375 18.6542 7.15571 17.4956 6.3057C16.337 5.45569 14.937 4.99821 13.5 5H10.5C9.19005 4.99993 7.90838 5.38103 6.81128 6.09682C5.71419 6.81261 4.84907 7.83217 4.32143 9.03115C3.79379 10.2301 3.62643 11.5568 3.83975 12.8492C4.05308 14.1417 4.63787 15.3442 5.52281 16.31C5.59048 16.3836 5.64276 16.47 5.67656 16.5641L6.90375 20H8.09625L8.45438 18.9978C8.50637 18.8522 8.60211 18.7262 8.72848 18.6371C8.85485 18.548 9.00568 18.5001 9.16031 18.5H15.5897C15.7443 18.5001 15.8951 18.548 16.0215 18.6371C16.1479 18.7262 16.2436 18.8522 16.2956 18.9978L16.6538 20H17.8463L19.5441 15.2478C19.5961 15.1022 19.6918 14.9762 19.8182 14.8871C19.9445 14.798 20.0954 14.7501 20.25 14.75H21C21.1989 14.75 21.3897 14.671 21.5303 14.5303C21.671 14.3897 21.75 14.1989 21.75 14V11Z" fill="#F44336"/>
</svg>
);

const BudgetSummaryCards = () => {
  const [totalBudget, setTotalBudget] = useState({
    count: 0,
    title: 'Total Budget Expenses',
    className: 'total-card',
  });

    const { currentUser } = useAuth(); 
  
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0
  });

  const fetchTotalBudget = async () => {
    if (!currentUser || !currentUser.department_id) {
            console.error("No departmentId found in currentUser");
            return;
          }
    

    try {
      const response = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/total-budget-count`);
      console.log("this is budget card:", response.data)
      setTotalBudget(prev => ({
        ...prev,
        count: response.data
      }));
    } catch (error) {
      console.error('Error fetching total budget:', error);
      setTotalBudget(prev => ({
        ...prev,
        count: 0
      }));
    }
  };

  const fetchStatusCount = async (status) => {
    try {
      let endpoint;
      switch (status) {
        case 'Pending':
          endpoint = 'pending-budget-count';
          break;
        case 'Approved':
          endpoint = 'approved-budget-count';
          break;
        case 'Rejected':
          endpoint = 'rejected-budget-count';
          break;
        default:
          throw new Error(`Invalid status: ${status}`);
      }
  
      const response = await axios.get(`${API_URL}/departments/${currentUser.department_id}/dashboard/${endpoint}`);
      setStatusCounts(prev => ({
        ...prev,
        [status]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching ${status} count:`, error);
      setStatusCounts(prev => ({
        ...prev,
        [status]: 0
      }));
    }
  };
  
  useEffect(() => {
    fetchTotalBudget();
    // Fetch counts for each status
    ['Pending', 'Approved', 'Rejected'].forEach(status => fetchStatusCount(status));
  }, []);
  
  const statusCards = [
    {
      title: 'Pending',
      count: statusCounts.Pending,
      icon: PendingIcon,
      className: 'pending-card'
    },
    {
      title: 'Approved',
      count: statusCounts.Approved,
      icon: ApprovedIcon,
      className: 'approved-card'
    },
    {
      title: 'Rejected',
      count: statusCounts.Rejected,
      icon: RejectedIcon,
      className: 'rejected-card'
    }
  ];

  return (
    <div className="budget-summary-container">
      <div className="row g-3 budgetsum">
        {/* Total Budget Card */}
        <div className="col-12 col-md-3">
          <div className={`budget-card ${totalBudget.className}`}>
            <div className="card-content">
              <div className="card-text">
                <h3 className="card-count">{totalBudget.count}</h3>
                <p className="card-title">{totalBudget.title}</p>
              </div>
              <div className="card-icon">
                {TotalBudgetIcon && <TotalBudgetIcon size={20} />}
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards Container */}
        <div className="col-12 col-md-9">
          <div className="status-cards-container">
            <div className="row g-0">
              {statusCards.map((card, index) => (
                <div key={index} className="col-12 col-md-4 status-card-col">
                  <div className={`budget-card ${card.className}`}>
                    <div className="card-content">
                      <div className="card-text">
                        <h3 className="card-count">{card.count}</h3>
                        <p className="card-title">{card.title}</p>
                      </div>
                      <div className="card-icon">
                        {card.icon && <card.icon size={20} />}
                      </div>
                    </div>
                  </div>
                  {index < statusCards.length - 1 && <div className="card-divider" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryCards;