import { SkyBackground } from "@/components/hero/SkyBackground";
import { Rope } from "@/components/hero/Rope";
import { BalloonsList } from "@/components/hero/BalloonsList";
import { MeetTheFive } from "@/components/meet-the-five/MeetTheFive";
import { LettersSection } from "@/components/letters/LettersSection";
import { GraduationWall } from "@/components/graduation/GraduationWall";
import { MemoryGallery } from "@/components/gallery/MemoryGallery";
import { EndingSection } from "@/components/ending/EndingSection";
import { DataProvider } from "@/lib/DataProvider";
import { getFriendsData, getGalleryPhotos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const friendsData = await getFriendsData();
  const galleryData = await getGalleryPhotos();
  return (
    <DataProvider friends={friendsData} gallery={galleryData}>
      <main className="relative flex flex-col items-center justify-between min-h-screen">
        {/* Hero Section Module 1 */}
        <section className="relative w-full overflow-hidden flex flex-col items-center pt-0 pb-16">
          <Rope />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <BalloonsList />
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-primary mt-16 md:mt-20 text-center">
            Our story begins here
            <span className="block text-3xl md:text-[44px] mt-1 font-normal text-secondary">2022 — 2026</span>
          </h1>
          
          <p className="mt-4 text-[14px] md:text-base text-secondary/80 leading-relaxed max-w-2xl text-center">
            Five friends. Four unforgettable years. One story worth remembering.
          </p>
        </div>
      </section>
      
      {/* Module 2: Meet The Five */}
      <MeetTheFive />
      
      {/* Module 3: Letters */}
      <LettersSection />
      
      {/* Module 4: Graduation Wall */}
      <GraduationWall />
      
      {/* Module 5: Memory Gallery */}
      <MemoryGallery />
      
      {/* Module 6: Ending */}
        <EndingSection />
      </main>
    </DataProvider>
  );
}
