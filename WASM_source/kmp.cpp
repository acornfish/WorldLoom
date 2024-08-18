#include <algorithm>
#include <vector>
#include <string>
#include <iostream>
#include <cstring>

using namespace std;
#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

void computeLPSArray(const string& pat, int M, vector<int>& lps)
{
    // Length of the previous longest prefix suffix
    int len = 0;

    // lps[0] is always 0
    lps[0] = 0;

    // loop calculates lps[i] for i = 1 to M-1
    int i = 1;
    while (i < M) {
        if (pat[i] == pat[len]) {
            len++;
            lps[i] = len;
            i++;
        }
        else // (pat[i] != pat[len])
        {
            if (len != 0) {
                len = lps[len - 1];
            }
            else // if (len == 0)
            {
                lps[i] = 0;
                i++;
            }
        }
    }
}

EXTERN int* KMP(const char* text, const char* pattern) {
    int ptlen = strlen(pattern);
    vector<int> lps(ptlen);
    computeLPSArray(pattern, ptlen, lps);

    vector<int> indexes;
    int pt = 0;
    for(int i=0;i<strlen(text);i++){
        if(pattern[pt] == text[i]){
            pt++;
            if(pt == ptlen){
                indexes.push_back(i - pt + 1);
                pt = 0;
                cout << indexes.back();
            }
        }else{
            if(pt > 0){
                i -= pt - lps.at(pt-1);
                pt = lps.at(pt);
            }

        }
    }
    
    int* ret = (int*)(malloc(sizeof(int)*(indexes.size()+1))); // ret[0] is array size
    ret[0] = static_cast<int>(indexes.size());
    for(int i=0;i<indexes.size();i++){
        ret[i] = indexes[i];
    }
    return ret;
}
    
int main(){
    return 0;
}