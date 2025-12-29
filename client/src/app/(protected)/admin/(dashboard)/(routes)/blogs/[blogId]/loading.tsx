"use client";

import { Loader } from "@/components/ui/loader";

const Loading = () => {
  return ( 
    <div className="w-full  flex-col min-h-full h-screen flex items-center justify-center">
      <Loader />
    </div>
   );
}
 
export default Loading;