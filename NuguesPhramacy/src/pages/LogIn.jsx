function LogIn() {
  return (
    <>
        <section className="flex flex-col justify-center items-center bg-[#F9FCFF] h-[100vh]">
          <div className="flex flex-col justify-center items-center">
              <header className="flex justify-center items-center mb-10 gap-2">
                <h3 className="border w-10 h-10 flex items-center justify-center rounded-xl bg-[#1B1967] text-white text">N</h3>
                <h3 className="text-2xl font-semibold text-[#1B1967]">Nuges Pharmaceuticals</h3>
            </header>
            
            <main className=" flex flex-col border-1 w-115 h-110 py-6 px-10 rounded-xl bg-[#FFFFFF]">
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-2xl font-semibold text-[#090F27]">Welcome back</h1>
                  <h3 className="text-sm text-[#6A7282]">Sign in to track orders and manages your profile.</h3>
                </div>
               
               <div className="flex justify-center items-center border rounded-xl py-1.5 ">
                   <button type="sumbit" className="text-bold text-[#100F27]">Continue with Google</button>
               </div>

               <div>
                  or
               </div>
                
            <div className="flex flex-col ">
               <div className="flex flex-col">
                 <form action="" className="flex flex-col">
                    <input type="email" placeholder="Email" className="border rounded-xl py-1.5 px-1 required"/>
                    <input type="password" placeholder="Password (min 6 chars)" className="border rounded-xl py-1.5 px-1 required"/>
                        <a href="" className="text-sm text-bold">Forget password?</a>
                      <div className="flex justify-center item-center border py-1.5 rounded-xl">
                        <button type="submit" className="flex justify-center item-center required">Sign in</button>
                       </div>
                 </form>

                  <div className="flex justify-center items-center">
                    <h2>New to Nuges?</h2>
                    <a href="">Create account</a>
                  </div>
               </div>
               
          </div>
            </main>
             <div className="flex justify-center items-center">
                  <h2>Back to Home</h2>
               </div>
          </div>

        </section>
    </>
  );
}

export default LogIn;