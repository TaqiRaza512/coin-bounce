#include<iostream>
using namespace std;
int main()
{
    // 567
    // 5+6 => 11 

    // 54589
    // 5+8=>13


    // 567%10 => 7
    // 567/10 => 56


    // 56%10 => 6
    // 56/10 => 5

    //5%10 => 5
    //5/10 => 0

    // 0%10 =>0
    // 0/10 =>0 




    int num=52;

    int modulus=0;
    int divideResult=0;

    // 12345


    while(num>0)
    {
        modulus=num%10;
        cout<<modulus<<" ";
        divideResult=num/10;
        num=divideResult;
    }

}