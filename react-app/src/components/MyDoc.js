import React, { Component } from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import List, { Item } from './List';


export  class MyDoc extends Component {
    print = () => {console.log("props", this.props)}
    render() {
        this.print()
        return (
            <PDFViewer>
                <Document title="Medical Consent Contract.pdf">
                    <Page style={styles.body}>
                        <View>
                        <Image
                            style={styles.image}
                             src =  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QB0RXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAABJKGAAcAAAAQAAAAXKABAAMAAAABAAEAAKACAAQAAAABAAAA/6ADAAQAAAABAAAAYQAAAABBU0NJSQAAAG1hZ2UgMTlK/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAGEA/wMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMEAwMDBAUEBAQEBQcFBQUFBQcIBwcHBwcHCAgICAgICAgKCgoKCgoLCwsLCw0NDQ0NDQ0NDQ3/2wBDAQICAgMDAwYDAwYNCQcJDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/3QAEABD/2gAMAwEAAhEDEQA/AP38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Q/fyiiigAooooAKKKKACiiigApD0NLQaAPDvjB+0F8OfgY+lJ4/ubm3bWTMLT7PbvcbvI2b87Adv+sXr617RBMs8ccyElJAGGeOD0r8ov+CnAxcfDr/rpqf8A7a1+q2mY/s62P/TJP/QRUxlq0fUZrk1DD5Rg8dC/PV5766e67I0KKKKo+XCiiigAooooAKKKKAG5Jrz74mfEvwv8I/CN1448YzSxaVZvDHK8MTTOGnkWNMIgJOWYZ9K9B6V8Y/t8/wDJtGv4/wCfvTc/+BcNKTsmz2eHsBTx2Z0MHVfuzkk/Rn0z8PvHvh74m+ENO8ceFJZJdK1RGktnljaJyqu0Zyjcj5lPWu1z6V8s/sXf8mzeCP8Ar1uP/Sqavdtd8feCPDGpWuj+I9f03S76+wLW1vLuKCacs2xfLR2DNlvlGAcnimnomzPNMvdHMK2Ew6b5ZSS6uybR1+c14X8TP2iPht8JfFGieD/GN1dQ6l4g2fYlhtpJkbfKIhudAQvzsBz25r3LOQCO9fkn+3t/ycH8KPrb/wDpwiqakuVXR6vBuS0M0zH6riL8vLJ6O2sU2j9bQcgHPWnZNMixsH0p4wKtnyzVnZDqKKKQgooooA//0f38ooooAaSccVyR8eeCl8TDwY2v6aNfP/MLN3F9tPyeb/qN3mf6v5+n3eenNdYRX5G3P/KTWI4xll/9MppSlZI+i4dySGZOupyt7OnKe27XQ/XPkc1laxrWk+H9Om1fXL2DTrG2G6e5upFihiXgZd3IVRkgZJ71rHn8K+ZP2xsH9mvx376aP/R0dN7XPMyvCLFYylhpOynJRv6ux77oHiTQPFWnJrHhjU7TV7F3ZFubGdLiFmQ4YB42Kkg8Hnipda1/RfDeny6t4gv7bTbKEZkuLuZIYUHqXcgD8TXwv+xX4o0jwT+yN/wluuS+Tp+kzaxeXD9/Lhmdjgd2OMAdzXyV4M8L/E39vr4k6j4k8YalcaP4H0W42rbxHKW4fJjtrdGBja4aM7ppnDFcjjBRRn7TRJLVn2dLgiH13FrE1uTDUJWlNrV9kl1bP0nf9rf9nFLz7A3j3SfM3bMrIxiz0/1gUp+O7Fe5aD4l8P8AirTo9X8M6naarZTfcuLOdJ4m9cOhI4r5Lt/2CP2a4tMGnyaDdzvs2m7k1C588n+9lZFTP/AMe2K84+FH7IPxF+CXxxTXPh74vaHwFKnm3trdDzLi5BJBtZIlCxMQMFbgbWUZG0nO5rnW6OavlvDVehUeCxM4zirpVIpKXkrbPseY/wDBTj/j4+HR/wCmmp/+2tfpRrfj3wZ4B8O22reNNasdFtPKUCS9nSEMwX7q7iCzey5PtX5q/wDBTp/Ll+Hj7c7H1RsdM4+ymui+EX7L99+0PDD8cP2kL28vG1mMS6PocEz21va2Dcw5KkOquuCqIV4wzlmYgRzNTaR9PVyrB1uGMBiswq8lKLmtFeUm5bJfm2fY/h/9qL9n/wAT6gumaR460h7qQ7I45Z/s5kYnACmYIGJPAwTmveVcOA6MGBGQR3FfnN8af2APhZfeC9S1H4X2txouvWNtJcW0P2mW4trt4lJ8qRJ2crvxtDKy7WIJBHFH/BOv4ta14y8Ea14A8RXMl3P4Vkt2sZp23Sixug4WIk8kQvGwBPRWC9FFVGbUuWR85mPDeW1sqnm2TVpSjTaU4zSUlfZq26P0bL7VyxwB3NeGeKP2mfgL4Pv30vXvHGkQ3kZ2yQxTi4eNvRxDvKn2OK+Hv2oPi58RPjJ8W4f2XPgxcvaxh/I1u8ikMfmSbd8sckqfMlvBGf3oX5nf5COMN7D4D/4J7fA3w7pMUPi6G78T6iyfv7ia4ltYd56+VFA6bV9N7O3vRztv3eg6PDWWYHCwxOe1pRlNXjCCTlbo5N6K/RH1n4I+K/w4+I8by+BfEmna2UGZEtLhZJIx0+dAd6jPqBXoRJ/Svyn+Pf7Flp8L9Fn+L/7PN/qOjat4aRr+WyW4eQm3hG6R7eViZAyKNzRuzrIoK8HGfr79lL45N8dvhZb6/qflprumSnTtWSPARriNQyzIo6LMjB8dA2QMgZpxm72kcWccOYWOCWa5TVdSjflkmrSg+l1tZ9Ge++IPFHhzwpYPqvifVLPSbOP7097OlvEPq8hUZP1rw2b9rz9nCC6Nm/j3SS+du5Hd04/21Upj3zivBvid+xVrfxk+NF74t8f+Nby48HlY5LLT48farcnh7eLI8mKJcBvMCmR92G5G494f2Cv2a/7PNj/wj9z5mzb9q/tG68/OMbv9bsz3+5j2o9/ojfD5fw1So03jMTOU5K7UIq0fK8t2fVnhzxX4b8X6ZHrPhbVLTV7GXOy4s5kniOO25CRkelfKf7e/P7NGvn/p70z/ANLIq+ItJ0nX/wBiv9qzRvCWlanPeeEfFktojRznHm2l5KbdTKqgJ59rKMhwBuQdtxA+2/298H9mfX2He603H/gZFUOd4ST6Hr4Th6nluf4Cph6nPRquMoStZ2vqmu6Ln7Jnibw54R/ZX8Ear4q1Wz0my8iaP7RfTpbxeY11Nhd8jBcnHAzk18Uftn+N/Bfif9oH4Y6x4c1zTdUsLL7J9qurO6inhgC36O3mOjFVwoyckYGa+ofgb8IfCfxu/Y48EeCvGTXS6cA13mzlEUvmQ3U+35irccnIxXwh+0z+zt8P/hF8X/AngTwo1+2m+Izbi9N1OJZf3t2kB2NsAU7CccHntU1XL2enZH0/CFHK5cR4qdWpJVr1vd5Vy8uut+9ulj9k7b43/Bud47eHx14deWVlREXVLYsztgKoHmZyTwB1r84v29G3ftBfCgjHW26/9hCL/PevoPTf+CeXwD02+s9Tgl13zrOaK4j3Xyld8TB1yPK6ZHI9K+YP+CjGpyaB8Xvh9rMCCSTTbBrxEf7rNb3aSANjBwSoyR2p1XLkuzzOCMJlX+sNOnlVWU7wqJ80VGz5Xa2p+qPjH4leAvhzp8eoeOdf0/RIJB+7N5cLE0mOoRD8zn2UGuJ8KftKfArxrqSaR4b8baTc3srbY7dp/JlkbOMIsoQsT6DJr5E+FP7Hi/Fi3Hxg/aYvL7WfEHiFRdx6UJnt4bK2k+aKJvLYOCqEYjVkVB8pDNk1k/tHfsIfDjTvh7q3jH4UW9xpWq6JavfNZG4kuLe6hgUvIoEzOySbAShVsEgAjnItzn8SPCw+Q8N/WVl+Jxc/at25oxXIpdtdWr9T9QUfcMg5B6GpM18J/sDfFvWfiV8JbjRvEl097qXhW8FiLiVi8k1nIgkt2kYklmUbo8nkhRnnJr7qGM1cZKSuj47PMpq5Zj6uArfFB2/4I+iiimeUf//S/fyg9KKKAGjrivyNuf8AlJrF9V/9Mpr9cTX47ePtVh8Df8FHdM1rWm8izvZ7BFlf5V2Xlh9jVsnjAl4J7YNRVeifmj9B8PYOdXGUobujO3nsfsSeua+Zv2xv+TbPHf8A2DR/6Ojr6XVt4yOmOo7ivhj9vz4k6P4U+B974PknQ6t4rkis7a3B+fyIZElnlI7KqrtJ9XAp1GlFtnz/AAnhKuIznDUqKblzx/B3Z8k6Ze3dn/wTa1D7KWAuNYeCUjP+rk1NN2fY9D9a+zP2BNNsbH9m3RbizVRJqF7qNzcsOrS/aZIufcJGo+gFeO/s4fDpfix+wtqPgJXWOfU5dUW1duiXUVyZIGb2Eqrn2rz39hz48ad8LrrVfgD8VpP+EfuIdSlksJL0+VHFdMQs9pKzcIS43xk8MWbnJUHCMrOLe1j9V4hoyx+XZjhMGr1KddzcVu47Xt1sfrvR0981XS6gkQSpIrIwyGBBBB5znPTFeBL+1B8HD8Vovg/FriTa5NiNJIwHszdliBaecpK/aOM7en8Od3y11Oy3PxbDZdisRzewpuXKruy2Xdnw/wD8FPEEkvw8jPR31RT9D9lFfqd4ftILHRNPsrZBHDb2sMUagYCqihVA9MAV+Wf/AAU4/wCPj4c+8mp/+2tfqtpeP7Otf+uKfyFYx/iS+R9nn8n/AKtZbHzqf+lFuYDyXz3Br8jP+CeCCD4p/FOOIYWNUVQOOFurkD9K/XSb/VP9DX5I/wDBPIZ+LXxUH+5/6V3NOp8UfmacJv8A4Q81v/LD/wBKPm34FeM/jVpPxr8beKvhR4YtvFfiG6kvvt0d3yYIZ7wu7r++gOS6qp6/SvtP/heH7fecj4S6X+R/+Tq8M8Xy6t+xp+11N47ntJZfB3i2S5mYxLkPa3riS4jTsZbWfEgXOSm0Z+bj9dPCPjnwp490O38SeENVttU0+6UNHNbyBhz/AAt3Vh/EpwwPBGazpResU7H1/GebUY/V8whgoVaM4RtN33Ss4uzsrH55X/xj/bz1OxuNOufhJpjQ3MTwyALyUkBDDm+PY1ofsBfCj4p/Cu58ZW3xA0C50S01BNOe1+0PEwkki88PtEbv0VlznHGOtfX3xo+PHgH4I+GZ9c8UX8b3hQ/YdMhcG7vJcfKiJyQucbnI2oOSegNf4OfF6H45fCmPx5omm3WkzXKTQeRdqcC5iGGMMuAs0O7hZFAzgggMGAtJc+r1Pl8RnOLqZNOnRwMKWHqyScldarVbvW3c+Z/jV+3C3h3xpJ8Lvgl4fbxh4lina0lkAeS2S5U4eKKKEeZcMhyHIKqpB5ODjjrW7/4KSeLF+3xJovhuOblYZUtFZQf9k/aXGB2Y5+leJ/8ABPTXvCvhz4teKtI8ayRWfiW/txBZPeEI5limf7XCrOQfNdthK9W2H0r9mbzUtP061lv9QuYra2gUySTTOI40ReSzMxwAB3Jop3l7zfyO/iKWG4erwy7B4KE3yxfPUXM5Nrp0t6H4Q/HDS/jxpfxq+HUfx91Ox1PVJLuxaxex8valuL6IMreXDCM7+ehr9H/29cf8My6973Wmf+lcVfnd+0h8XdM+L37THhfWfDhM/h3RdR07SbG+CkRXckN2ktxJGTwyhpVAIzlQG6MM/oj+3qD/AMMy68fS60z/ANLIayhblnbU+kzVV1jMieJpqEt+WKsleS0t09Dq/wBiz/k2fwSf+nW4/wDSqavjX9uz/k5L4T/9uX66lHX2V+xX/wAmz+Cf+vW4/wDSmavi79veeOx/aF+FeoXTeXbwrbO8rcIqxahGzkn/AGRyfatav8P7j5/hZX4xxK/6/fkz9cl+6vHYV+RX/BQSzh1D47fDDT7kbobmKKGRfVJL6NWH5E1+uMTB41cHggGvyW/b15/aD+E/pm27/wDT/F+NPEfAeJ4Z3WeX68lT/wBJZ+tUKBYkUDAVQAPQVleJo45vDeqQyqGR7OdGB5yChBFbUf3F+lZXiD/kA6j/ANe03/oBrRnw+Ff+0wf95fmfl3/wTA40nx8uePtWmf8Aoqev1cwK/KP/AIJgf8grx9/19aZ/6Lnr9Xamn8CPrfEf/kocR/27/wCkoKKKKo+HP//T/frdTGdVGWYD1zXgfxK+Hfxh8aa4JPCXxLl8IaF9nRGs7HS7e4uXmBbe/wBpmJKgggAKvGPevKLj9jGx8RKD4++JvjzxCWzujk1UQQHPX92keAPYGk290j28Jl+BlTU8TiVHyUZSf6L8T6p1rx34K8OKX8Qa/pmmgc/6XdxQdP8AfYV+aH7Zjfs4fGK3s9d0j4kaFYeLNIiaCKRZXu4Lq3JLCGU2qyspVssjgNtJYEHOR9H6b+wT+zZYv5t1oV3qUnVnvNRuWZj77JEB/KvQdM/ZL/Zy0nH2bwFpDlehuITcnj/rsz5/GplGUlayPpMkzLJcoxUMXh61Vzj2UUn3Tu3ofjfo/wC2f+0V4O07/hGrPxfDqNvagww3N1bRXUu1eAVllRZHwOhkBPrXH3nxK8J+LtH8SeJPidfa34t+IGsWLWemTTJCun6blgd6/vQxOMhQkSogYlVJO4fv5p/wU+D2lgCw8EeHrfb0KaZbA/n5ea6618J+F7AbbDSLG2A6eTbxoP8Ax1RWP1eb0cj7OXihktObqYLAckm7uSai3Z33S2b3R+Lf7O37Yl/8E/hnD8P7XwRe+IJ4by6uVuI7gxJtuH3hdqwStkVxfxx+Jl7+0HN/azfBi+03XiiomrWJu5JnUfdEyLaKkwA4G75gOjAcV++KWttENscSKBxgKB0qURIo+VQKt0ny8jeh4dLxFwNDMJZph8ClVk22/aS676bW8j+Zyy8CftBvY/2XYaB40FiRt+zxWuoLBt9NgULj8K9W+EGhftHfCDUm1/wf8KLu61dlKxahqeh3dxNbI33lhG6OOMt3IXcRxnbxX9CG32/GiojhknfmZ6mL8ZJ16UqLwNPllurvX1tY/BL4vaf+2N8eX0p/HPgLUn/sczNaC10trbaZ9m/cWc5/1a4/H1r1yP4jf8FHZI0gt9BvoUQYAGkWYwB0+/mv2RAGTRgY44q/ZNO/MzxaviRTqUYYeWX0eSF+VNOyvvb1Pxrfxd/wUouVK/2fqaA9hYaYv/oQrybwD8LP23Phnqmqa34G8O6ppV7rRH26VVsJPN+dnHErMF+Z2PGPyr97ccUYo9i3vJlUPE50ac6NDA0YxnpJJb27n4Z+OPBX7e/xL0R/DvjrRb7V9Pd1k8meLShskQ8MjLtdWGcBlIOCR0rynTP2V/2rtFd5tF8K6vp7ycO1pfwW7MPcx3Kk1/RH+FLwKUsNFvU68P4vYyhS9jQwtOMe1tPuP50rr9kr9qG9uTe3/g3UbqdyC0txdWsztj+8XuCW/GvoTTo/+CjejWMGm6XZaja2ltGsUNvDBo6RxxoAFVVA2gKBgAdK/anjHSk7YxTjQS2ZGM8W8VioKnicJTklsmtvQ/nh8Vfs3/tWeMPEF34p8Q+Cb651S/k8+4uIxZQ+ZLgZkKQyIgdsZJCglsk81Q1H9nT9rC/sxp+qeF/El5ar0t5roTRDHTCNOyj8q/osxS4zUvDRvudcfGfHpRj9Wp2jtpsfzy6t8Hf2q9Q07w3pdx4A1CG28JbzpaWljBH5bvIkru5Rsys7xqxZ8knNeq/EvxL+3L8UvBt14G8a+CNQuNLu3heQW+jNHLmCRZUw6M2PmQZ4r9xMY/Gk6f40/Yf3mctXxYqVKkKtbBUpSg24t3um3dta73PxX+Gnxg/bN+EHgzTPAui/DK4n0zSUeOA3Wh3zylXdnO54pFB5Y9BXmn7QHjf4/fHqz0uPx18LL3TrzR3kMF7ZaVqMb+VMo8yJxIHUqxVW9QRxwTX76ECkKqeoodFtW5mZYbxKwtHGfX45dTVW7fMnJO73+8/nEX4oftRaVp9po17qnjJNMsmixbPHdw5iiIIjMnlhypA24JIxxXX/AB7/AGiLj4x/ELwb43vPC95og8LmLzbeSQymcR3KT/IzRRhSQhGD9c4Ff0E+VHj7oqJ7GzmBEsEbg8fMoP8AOj2DtbmO1+KWDliI4p5fGM0pK8ZNaS0d9Nfmfnlpf/BSr4KSgJqej+IbI+vkW8oH/fNwGx/wHNdq37en7N+vaReWia7dWU01vIipd2FyvzMpABaON1HPvX17eeC/B+oArqGiafcg9RNaxSZ/76U1x2ofAv4MaoD9v8C+HpiepbS7bP5+XVtT7ny0cy4Yc1P6rUi7p6TT/NH5kf8ABOr4i+A/A1p40svGXiDTdDn1C409rZNQuo7YyiNJt2zzCoO0sAcdK/WzSvFnhjXkEuh6vY6ijdGtbiOZT+KMa8M1T9kH9m3Vs/aPAelxk9TbLJb9f+uTpXAX37An7Oc8hn03TNR0eXORJYancIwPqN7uB+VEYyjFI6OIMxyHOMbPHOdSnKVtHGMlordHfofaIO4cHP40/p1r4rg/ZB1Hw6oHw/8Ai5470QL9yKbUEvoF/wC2UsYUivoj4Y+F/HXhLRZ9M8e+LW8Y3RuWe3vZLKKwkjtyqhY3WElXIYMd/BO7HYVd+6PlMfgcFThz4XEKflyuL/HT8T//1P38ox3oooAKMCiigAwKMCiigAwKMCiigAowKKKAEwOtLRRQAUUUUAGBRRRQAUmBS0UAGBRRRQAYpMClooAMCkwKWigAwKKKKADAooooAKTApaKADAFGBRRQB//V/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k='
                            
                        />
                        </View>
                        <Text style={styles.title}> 
                            Getting the Best Result from Controlled Substance Medications: A Partnership Agreement
                        </Text>
                        
                        
                        
                       
                        <Text style={styles.text}>
                            This agreement is a basis for communication between my health care provider and myself. 
                            The goal of treatment is to help me or my dependent function better. My provider and I 
                            will be partners in creating the best treatment plan for me. As patient and health care 
                            provider, we respect each other's rights and accept our individual responsibilities.
                        </Text>
                        <Text style={styles.text}>
                            I understand that <Text style={styles.var}>{this.props.doctor.name}</Text> (hereafter referred to in this agreement as the health 
                            care provider) is prescribing a controlled substance for the following reason(s): {"\n"}
                        </Text>
                        <Text style={styles.list}>{
                            this.props.meds.map((med) =>  <Text key={med.id} style={styles.var}>{med.reason}{"\n"}</Text>)} 
                        </Text>

                        <Text style={styles.text}>
                            I am being prescribed a medication(s) that is a controlled substance; this means the use of this group of medications is regulated by Federal and State laws. The prescribing and dispensing of these medications are recorded in the Colorado Prescription Drug Monitoring Program website. This can be accessed by health care providers and pharmacists. It is my health care provider's responsibility to continually reevaluate my response to the medication,assess for side effects, and monitor adherence to treatment.
                        </Text>
                        <Text style={styles.text}>
                            The following medications are covered under this controlled substance agreement:
                        </Text>
                        <Text style={styles.list}>
                            {this.props.meds.map((med) => <Text key={med.id} style={styles.list}> <Text style={styles.var}>{med.name}</Text> <Text style={styles.text}> which is an FDA schedule</Text> <Text style={styles.var}>{med.schedule}</Text> drug.{"\n"}</Text>)}
                        </Text>
                        <Text style={styles.text}>
                            I, <Text style={styles.var}>{this.props.patient.name}</Text>, understand that adherence with this treatment agreement is necessary for continuation of treatment. My medications are only part of the overall treatment plan which may include psychotherapy, psychological assessments, counseling, physical therapy, vocational rehabilitation, other medications, or other recommended treatments as determined by my health care provider. Therefore, I agree to the following:
                        </Text>
                        
                        
                        <Text style={styles.text}>
                            The patient understands that it is equally important for providers that their patients on controlled substance medications will:
                        </Text>
                        <List>
                            <Item> 
                                Take medication only at the dose and time/frequency prescribed.
                            </Item>
                            <Item> 
                                Fill prescriptions at one pharmacy of choice: ***
                            </Item>
                            <Item>
                                Make no changes to the dose or how the medication is taken without first talking to the provider.
                            </Item>
                            <Item>
                                Not ask for pain medications or controlled substances from other providers.  The patients will also tell every provider all medications they are taking and notify their provider if controlled medications are prescribed by any other physicians.
                            </Item>
                            <Item>
                                Arrange for refills only through the provider’s clinic during regular office hours[UCHS OPIOID REFILL DAYS:27381]  Ask for refills three business days in advance and not ask for refills earlier than agreed upon.
                            </Item>
                            <Item>
                                Protect prescriptions and medications from loss, theft or damage.  A police report may be requested in cases of theft but does not guarantee prescription replacement.  It is very important to keep medications away from children because of the risk of overdose.
                                Keep medications only for their own use and not share them with others.
                            </Item>
                            <Item>
                                Be willing to be involved in programs that can help improve social, physical, or psychological functioning as well as daily or work activities.
                            </Item>
                            <Item>
                                Be willing to learn new ways to manage their symptoms by attempting step-by-step behavior and lifestyle changes in their daily life.
                            </Item>
                            <Item>
                                Understand that medications may be decreased or stopped if there is worrisome alcohol or illegal/street drug use.
                            </Item>
                            <Item>
                                Understand that under Colorado Law, it is a misdemeanor to drive under the influence of, or impaired by the use of controlled substances.
                            </Item>
                            <Item>
                                Be willing to bring medicine bottles to the clinic when asked.
                            </Item>
                            <Item>
                                Be willing to have random drug testing when asked.  Testing may be done to ensure that medications are being used safely and results will be considered protected health information.
                            </Item>
                            <Item>
                                Be willing to schedule and keep follow-up appointments at requested intervals.
                            </Item>  
                        </List>



                        

                        <Text style={styles.text}>
                            We agree that the provider may stop prescribing the medication or the patient may decide to stop taking the medication if there is no improvement in symptoms or function, there is loss of improvement from the medication, or there are significant side effects from the medication.  Talk to your provider prior to making any changes.
                        </Text>
                        <Text style={styles.text}>
                            For patients taking opiate or sedative/sleep medications: Side effects of may include, but are not limited to, rash, nausea, constipation, itching, drowsiness, confusion, increased feeling of pain, breathing problems, heart problems, hormone problems and even death.  Dependence and addiction may occur with the use of these medications.  Overdose of narcotic pain medication or sedative medications can be very dangerous and even fatal.  We both realize and have discussed that there can be limitations to opioid therapy. It may not be helpful or only partially helpful and is only one part of the treatment.
                        </Text>
                        <Text style={styles.text}>
                            For patients taking stimulant medications: Side effects of stimulant medications may include, but are not limited to tics, psychosis, sleeping difficulty, heart problems, elevated blood pressure, priapism, rash, nausea, emotional lability and even death. Overdose of stimulant medications can be very dangerous and even fatal.  We both realize and have discussed that there can be limitations to medication therapy. It may not be helpful or only partially helpful and is only one part of the treatment.
                        </Text>
                        <Text style={styles.text}>
                            We understand that if this agreement is not followed, the patient may not be able to obtain controlled medications from UCHealth primary care providers.
                        </Text>
                        <Text style={styles.text}>
                            We agree to work together in an active partnership, learning from both successes and failures, to find the most effective ways to control and improve symptoms and improve functioning.
                        </Text>
                        <Text style={styles.text}>
                        {"\n"}Patient Signature:______________________________      Date:_________ {"\n"} {"\n"}
                        </Text>
                        <Text style={styles.text}>
                            Provider Signature:_____________________________      Date:_________
                        </Text>
                        
                        
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
            </PDFViewer>
        )
    }
}

const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      paddingBottom: 10,
      textAlign: 'center',
      fontFamily: 'Times-Roman',
      fontWeight: 'bold',
      
    },
    text: {
      padding: 6,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman',
      fontWeight: 'normal',
      
    },
    list: {
        paddingTop: 0,
        paddingLeft: 40,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'justify',
        fontFamily: 'Times-Roman',
    },
    var:{
        fontWeight: 'bold',
        textDecoration: 'underline',
        
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 150,
        marginVertical: 15,
       

    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });

export default MyDoc
