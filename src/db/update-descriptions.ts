import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { product } from "@/db/schema"
import { eq } from "drizzle-orm"

const descriptions: Record<string, string> = {
    // ========================================================
    // WOMEN — CLOTHING — COATS
    // ========================================================
    "wool-blend-double-breasted-coat": "A timeless double-breasted coat crafted from a premium wool blend. Structured shoulders and a tailored silhouette make it the perfect layering piece for the office or a night out.",
    "trench-coat-classic-fit": "The quintessential trench coat in crisp cotton gabardine. Storm flap, belted waist and deep pockets — a wardrobe staple that works season after season.",
    "puffer-coat-oversized": "An oversized puffer coat made from recycled polyester. Lightweight yet seriously warm, with a relaxed fit that looks great thrown over everything.",

    // DRESSES
    "floral-wrap-midi-dress": "A flowing wrap midi dress in 100% viscose with an all-over floral print. The adjustable tie waist flatters every figure and makes dressing effortless.",
    "satin-evening-slip-dress": "A sleek satin slip dress that transitions seamlessly from dinner to dancing. Minimal seaming and a bias cut let the fabric do all the talking.",
    "striped-cotton-shirt-dress": "A relaxed shirt dress in a classic nautical stripe. Crisp cotton construction, button-through front and a removable belt for a laid-back summer look.",

    // JACKETS
    "denim-jacket-oversized-women": "A slightly oversized denim jacket in 100% cotton — the one you reach for every day. Worn-in washes and sturdy seams mean it only gets better with time.",
    "leather-biker-jacket-women": "A genuine leather biker jacket with asymmetric zip and moto stitching. Structured yet supple, it adds an edge to any outfit from jeans to dresses.",
    "blazer-single-button-women": "A single-button blazer in a refined wool blend. Clean lines, notched lapels and a nipped-in waist keep it sharp whether you're in a boardroom or at brunch.",

    // JEANS
    "high-rise-slim-jeans-women": "High-rise slim jeans in a stretch cotton blend that holds its shape all day. A clean, flattering cut that pairs with everything from tucked shirts to oversized knits.",
    "straight-leg-jeans-raw-women": "Straight-leg jeans in raw 100% cotton denim — no stretch, no nonsense. The sturdy construction softens and fades beautifully with every wash.",
    "flared-jeans-70s-style-women": "A seventies-inspired flare jean with a high waist and subtle kick at the hem. Cotton blend fabric moves with you while keeping a clean, retro silhouette.",

    // JUMPSUITS
    "linen-wide-leg-jumpsuit": "A wide-leg jumpsuit in 100% linen — the answer to effortless warm-weather dressing. Adjustable straps and deep side pockets make it as practical as it is chic.",
    "satin-utility-jumpsuit": "A satin utility jumpsuit with cargo pockets and a cinched waist. The contrast of polished fabric and utilitarian details makes it a standout evening piece.",
    "denim-shortall-jumpsuit": "A classic denim shortall in sturdy cotton. Adjustable shoulder straps and a relaxed bib front give it a cool, laid-back energy perfect for summer days.",

    // LINGERIE
    "lace-bralette-set": "A delicate lace bralette set in nylon with intricate floral lace trim. Light, breathable and beautiful — designed to be seen as much as worn.",
    "silk-slip-camisole": "A 100% silk slip camisole with thin adjustable straps and a bias-cut hem. Luxuriously smooth against the skin and styled as easily under a blazer as on its own.",
    "cotton-comfort-brief-set": "A three-pack of everyday briefs in 95% cotton with just enough stretch for all-day comfort. Clean, minimal and available in versatile colourways.",

    // NIGHTWEAR
    "satin-pyjama-set-women": "A satin pyjama set with a relaxed button-through shirt and wide-leg trousers. Soft, cool and elegant — the kind of sleepwear you'll want to wear all weekend.",
    "flannel-check-pyjama-women": "A cosy check pyjama set in 100% cotton flannel. Brushed for extra softness, with an elasticated waist and chest pocket for a classic, comfortable look.",
    "oversized-sleep-shirt-women": "An oversized sleep shirt in 100% cotton with a dropped shoulder and curved hem. Minimal, comfortable and the kind of piece you'll live in.",

    // SHIRTS & TOPS
    "poplin-button-up-shirt-women": "A crisp poplin button-up in 100% cotton with a slightly relaxed fit. Tuck it in, tie it up or wear it open over a camisole — it works every way.",
    "ribbed-knit-tank-top-women": "A ribbed knit tank top in cotton rib that hugs without clinging. A true wardrobe workhorse — layer it, tuck it or wear it alone.",
    "linen-cropped-top-women": "A cropped linen top with a boxy fit and raw-edge hem. Lightweight, breathable and effortlessly cool for warm-weather days.",

    // SKIRTS
    "pleated-midi-skirt": "A pleated midi skirt in satin polyester that moves beautifully with every step. The elastic waist and fluid drape make it as comfortable as it is polished.",
    "denim-mini-skirt": "A classic denim mini skirt in 100% cotton with a straight-across hem and zip fly. Timeless, versatile and endlessly wearable.",
    "floral-print-wrap-skirt": "A wrap skirt in lightweight viscose with a vibrant floral print. The adjustable tie waist and fluid swing make it a warm-weather essential.",

    // SOCKS
    "ankle-socks-5-pack-women": "A five-pack of cotton blend ankle socks with cushioned soles and a snug ribbed cuff. Everyday essentials in classic colourways.",
    "knee-high-knit-socks-women": "Knee-high socks in a wool blend with a textured knit finish. Keep them slouched for a relaxed look or pull them up for extra warmth.",
    "no-show-socks-3-pack-women": "A three-pack of no-show socks with a silicone heel grip to keep them in place. Invisible under trainers, ballet flats and loafers.",

    // SWEATERS & CARDIGANS
    "cable-knit-oversized-sweater-women": "An oversized cable knit sweater in a cosy wool blend. The chunky texture and relaxed fit make it the ultimate throw-on-and-go piece for cooler days.",
    "open-front-cardigan-women": "An open-front cardigan in knit cotton with a longline silhouette and deep drape. Layer it over everything for an effortlessly put-together look.",
    "turtleneck-ribbed-sweater-women": "A fitted ribbed turtleneck in cotton rib that keeps its shape wash after wash. Clean, minimal and endlessly versatile.",

    // SWIMWEAR
    "triangle-bikini-set-women": "A classic triangle bikini set in a polyamide blend with adjustable ties for a custom fit. Minimal coverage, maximum confidence.",
    "one-piece-swimsuit-ribbed": "A ribbed one-piece swimsuit in nylon with a scoop neck and high-cut leg. Structured yet stretchy for a flattering fit in and out of the water.",
    "high-waist-bikini-bottom": "High-waist bikini bottoms in polyamide with full coverage and a smooth finish. Pair with any top for a retro-inspired look at the beach or pool.",

    // TROUSERS
    "wide-leg-linen-trousers-women": "Wide-leg trousers in 100% linen with a high waist and side pockets. The relaxed silhouette drapes beautifully and keeps you cool all summer long.",
    "tailored-slim-trousers-women": "Slim tailored trousers in a wool blend with a flat front and clean finish. Boardroom-ready and polished, pair them with a blazer or a crisp shirt.",
    "jogger-pants-relaxed-women": "Relaxed jogger pants in cotton french terry with an elasticated waist and cuffed hem. Comfortable enough for the sofa, cool enough for the street.",

    // ========================================================
    // WOMEN — SPORTSWEAR
    // ========================================================
    "insulated-ski-jacket-women": "An insulated ski jacket in recycled polyester with waterproof outer and taped seams. Designed for mountain performance without sacrificing style on the slopes.",
    "ski-bib-pants-women": "Waterproof ski bib pants with adjustable braces and reinforced knees. Built to keep you warm and dry through a full day on the mountain.",
    "thermal-base-layer-set-women": "A merino wool blend base layer set that regulates temperature on and off the slopes. Soft, moisture-wicking and odour-resistant.",
    "running-belt-waistpack-women": "A lightweight running belt waistpack in nylon with a water-resistant zip pocket. Holds your essentials without bouncing or chafing on the run.",
    "sports-water-bottle-750ml-women": "A 750ml BPA-free sports bottle with a leak-proof lid and ergonomic grip. Keeps your water cool for hours during training or commuting.",
    "yoga-mat-non-slip-women": "A non-slip yoga mat in TPE foam with alignment lines and a carry strap. Provides cushioning and grip on any surface for confident practice.",
    "compression-leggings-78-women": "7/8 length compression leggings in nylon blend with a high waistband and squat-proof fabric. Move freely through any workout without adjusting.",
    "sports-bra-medium-support-women": "A medium-support sports bra in polyester blend with adjustable straps and a moisture-wicking inner. Supportive, comfortable and designed to move with you.",
    "oversized-training-hoodie-women": "An oversized training hoodie in cotton blend with a kangaroo pocket and dropped shoulders. Warm up in it, wear it to the gym or pull it on after your cool-down.",
    "running-shoes-air-zoom-women": "Lightweight running shoes with a mesh upper for breathability and cushioned midsole for all-day comfort. Designed for speed, built to last.",
    "training-shoes-ultraboost-women": "Primeknit upper running shoes with responsive Boost cushioning. Energy return and all-terrain grip make these the go-to shoe for serious training.",
    "crossfit-training-shoes-women": "Versatile cross-training shoes with a flat, stable sole for lifting and a grippy outsole for cardio. Built for the demands of CrossFit and functional fitness.",

    // ========================================================
    // WOMEN — SHOES
    // ========================================================
    "classic-leather-ballerina": "Classic ballet flats in genuine leather with a padded insole and flexible sole. Timeless, polished and comfortable from morning meetings to evening drinks.",
    "bow-detail-ballet-flat": "Ballet flats with a sweet bow detail at the toe in synthetic upper. Feminine and understated, they complement both casual and smart-casual looks.",
    "pointed-toe-ballerina": "Pointed-toe ballet flats in leather with a sleek finish and slim silhouette. The elongating toe makes them a versatile choice for work and beyond.",
    "ankle-chelsea-boots-women": "Leather Chelsea boots with elastic side panels and a block heel. Easy to pull on and off, they look as good with jeans as with a midi skirt.",
    "over-the-knee-boots-women": "Faux leather over-the-knee boots with an inner zip and low block heel. A statement piece that pairs perfectly with mini skirts or skinny jeans.",
    "combat-lace-up-boots-women": "Leather lace-up combat boots with a lugged sole and D-ring hardware. Built tough and styled to last — a wardrobe investment piece.",
    "oxford-leather-brogues-women": "Full grain leather Oxford brogues with traditional brogue detailing and a low heel. Sophisticated and gender-neutral, they add polish to any outfit.",
    "wingtip-brogue-shoes-women": "Leather wingtip brogues with classic perforations and a stacked heel. A refined take on a heritage shoe that works with trousers or tailored dresses.",
    "suede-brogue-platform-women": "Suede platform brogues with a chunky sole and classic brogue detailing. The platform adds height without sacrificing comfort for all-day wear.",
    "canvas-espadrille-wedge-women": "Canvas wedge espadrilles with a jute rope sole and ankle tie. A summer staple that adds height and a relaxed Mediterranean vibe to warm-weather outfits.",
    "stripe-jute-espadrilles-women": "Striped canvas espadrilles on a classic jute sole. Lightweight, breathable and the perfect slip-on shoe for beach days or casual summer outings.",
    "slip-on-flat-espadrilles-women": "Flat canvas slip-on espadrilles in a clean, minimal design. The flexible jute sole and breathable upper make them a go-to for easy warm-weather dressing.",
    "leather-penny-loafer-women": "Full grain leather penny loafers with a classic saddle strap and low heel. Effortlessly smart, they look equally at home in the office or at the weekend.",
    "horsebit-chain-loafer-women": "Leather loafers with a signature horsebit chain detail and a low block heel. A polished, iconic style that elevates both formal and casual outfits.",
    "platform-loafer-chunky-women": "Platform loafers in faux leather with an exaggerated chunky sole. A fashion-forward take on a classic silhouette that adds attitude to any look.",
    "suede-slide-mule-women": "Suede slide mules with a squared-off toe and minimal upper. Clean, contemporary and comfortable — a minimalist's dream shoe.",
    "block-heel-mule-women": "Leather upper mules with a square toe and sturdy block heel. Sophisticated and easy to wear, they take you from desk to dinner without missing a step.",
    "pointed-toe-mule-flat-women": "Flat leather mules with a pointed toe and a barely-there upper. An elegant, understated shoe that works with everything from tailored trousers to flowy skirts.",
    "classic-stiletto-pump-women": "Leather stiletto pumps with a pointed toe and slender high heel. A timeless evening shoe that adds confidence and elegance to any formal outfit.",
    "block-heel-pump-round-toe": "Leather upper block heel pumps with a rounded toe. The stable block heel makes them far more wearable than a stiletto without sacrificing polish.",
    "slingback-kitten-heel-pump": "Suede slingback pumps with a kitten heel and almond toe. Delicate, feminine and comfortable enough for a full day of wear.",
    "leather-strappy-sandal-women": "Genuine leather strappy sandals with an adjustable ankle buckle and flat sole. Versatile enough for both relaxed daywear and smarter evening occasions.",
    "platform-sandal-cork-sole": "Platform sandals with a leather upper and natural cork sole. The modest platform adds height with an earthy, summery aesthetic.",
    "toe-post-flat-sandal-women": "Flat toe-post sandals in synthetic leather with a cushioned footbed. Simple, comfortable and endlessly wearable through the warmer months.",
    "fluffy-faux-fur-slippers-women": "Faux fur mule slippers with a cushioned sole and cloud-like upper. Slip into them the moment you get home and wonder how you ever lived without them.",
    "classic-flip-flops-women": "EVA foam flip flops with a contoured footbed and durable thong strap. Lightweight, waterproof and built for easy wearing from poolside to street.",
    "memory-foam-house-slippers-women": "Memory foam house slippers with a non-slip sole and a cosy upper. Your feet will thank you every single evening.",
    "air-max-classic-women": "Classic mesh and leather trainers with iconic Air cushioning and a clean, timeless profile. Equally at home on the street as in the gym.",
    "superstar-sneaker-women": "Iconic leather upper trainers with a rubber shell toe and serrated outsole. One of the most recognisable shoes in streetwear history — and for good reason.",
    "old-skool-canvas-trainers-women": "Canvas and suede low-top trainers with a distinctive side stripe and vulcanised sole. A skate-culture classic that has crossed into everyday style.",

    // ========================================================
    // WOMEN — ACCESSORIES
    // ========================================================
    "leather-tote-bag-women": "A spacious genuine leather tote with a structured base and double shoulder straps. The perfect carry-all for work, the gym or a weekend away.",
    "mini-crossbody-bag-women": "A compact faux leather crossbody bag with an adjustable strap and zip closure. Carry just the essentials without compromising on style.",
    "canvas-shopper-tote-women": "A large canvas shopper tote with internal zip pocket and reinforced handles. Durable, lightweight and the most useful bag you'll own.",
    "leather-belt-women": "A genuine leather belt with a polished silver buckle and clean finish. A simple, quality accessory that ties any outfit together.",
    "wide-woven-belt-women": "A wide woven textile belt in a geometric pattern with a hook-and-eye closure. Adds structure and interest to oversized shirts, dresses and high-waisted trousers.",
    "chain-link-belt-women": "A metal chain link belt that sits on the hips and adds an instant flash of glamour. Wear it over dresses, blazers or denim for a statement finish.",
    "leather-gloves-women": "Classic genuine leather gloves with a smooth finish and slim profile. Timeless warmth and elegance for cooler months.",
    "knit-winter-gloves-women": "Wool blend knit gloves in a relaxed fit that keep hands genuinely warm. A simple, cosy essential for cold commutes and winter walks.",
    "touchscreen-gloves-women": "Fleece gloves with touchscreen-compatible fingertips so you never have to take them off in the cold. Practical, warm and lightweight.",
    "satin-scrunchie-set-women": "A set of satin scrunchies in complementary tones. Gentle on hair, they add a polished touch to ponytails, buns and braids.",
    "velvet-headband-women": "A velvet headband with a padded, wide profile that stays in place all day. Effortlessly stylish and perfect for keeping hair back in a pinch.",
    "pearl-hair-clip-set-women": "A set of metal hair clips embellished with pearl details. Subtle, pretty and the kind of accessory that elevates any hairstyle.",
    "wool-fedora-hat-women": "A structured wool felt fedora with a grosgrain ribbon band. Sophisticated and versatile — as good with a winter coat as with a summer trench.",
    "baseball-cap-women": "A clean cotton twill baseball cap with an adjustable back strap. Minimal branding, maximum wearability for casual days and outdoor activities.",
    "knit-beanie-women": "An acrylic knit beanie with a classic ribbed cuff and a slightly slouchy fit. Warm, comfortable and the easiest accessory to throw on in the cold.",
    "gold-hoop-earrings-set-women": "A set of gold-plated hoop earrings in graduating sizes. Lightweight, versatile and the kind of jewellery you forget you're wearing.",
    "minimalist-watch-women": "A stainless steel minimalist watch with a clean dial and slim case. Understated elegance on the wrist — pairs with everything.",
    "layered-necklace-set-women": "A gold-plated layered necklace set with chains of varying lengths designed to be worn together. Effortless, feminine and flattering on every neckline.",
    "silk-square-scarf-women": "A 100% silk square scarf with a vibrant print. Wear it around your neck, tie it on a bag or wrap it in your hair — endlessly versatile.",
    "cashmere-blend-scarf-women": "A cashmere blend scarf in a generous size with a soft, draping weight. Incomparably warm and smooth against the skin.",
    "lightweight-linen-scarf-women": "A lightweight 100% linen scarf that works as a wrap, a belt or a beach cover-up. Breathable, natural and effortlessly stylish.",
    "oversized-cat-eye-sunglasses-women": "Oversized acetate cat-eye sunglasses with UV400 lenses. A glamorous, face-framing silhouette that never goes out of style.",
    "round-retro-sunglasses-women": "Metal frame round sunglasses with a retro, sixties-inspired aesthetic and tinted lenses. Cool, compact and universally flattering.",
    "square-frame-sunglasses-women": "Acetate square-frame sunglasses in a clean, geometric profile. A modern minimalist style that works on any face shape.",
    "leather-phone-case-women": "A genuine leather phone case with card slots and a slim profile. Protects your phone while keeping your essentials in one place.",
    "airpods-case-cover-women": "A silicone AirPods case cover with a carabiner attachment. Lightweight protection in a range of subtle, everyday colours.",
    "laptop-sleeve-13inch-women": "A neoprene laptop sleeve with a soft inner lining and top zip. Slim, padded and designed to slip easily into a tote or backpack.",
    "zip-around-wallet-women": "A zip-around genuine leather wallet with multiple card slots and a coin pouch. Generous capacity in a compact, well-organised design.",
    "slim-card-holder-women": "A full grain leather card holder with four card slots and a central cash compartment. The smarter, slimmer alternative to a traditional wallet.",
    "wristlet-clutch-women": "A faux leather wristlet clutch with a detachable strap and zip closure. Evening-ready yet compact enough for everyday use.",

    // ========================================================
    // MEN — CLOTHING
    // ========================================================
    "wool-overcoat-men": "A classic wool blend overcoat with a single-breasted front and structured shoulders. The essential outer layer for a sharp, polished winter wardrobe.",
    "trench-coat-men-classic": "A timeless cotton gabardine trench coat with epaulettes, belted waist and storm flap. Built for British weather, perfect for any occasion.",
    "parka-jacket-men": "A nylon shell parka with a fur-trim hood, multiple pockets and a warm inner lining. Built for the coldest days without compromising on a clean silhouette.",
    "bomber-jacket-men": "A nylon bomber jacket with ribbed cuffs, collar and hem. A versatile layering piece that adds a relaxed, athletic edge to any outfit.",
    "denim-jacket-men": "A classic cotton denim jacket with a structured silhouette and chest pockets. The kind of jacket you wear every day for years.",
    "blazer-slim-fit-men": "A slim-fit wool blend blazer with notched lapels and a two-button front. Equally sharp over a shirt and tie as over a plain T-shirt.",
    "slim-fit-jeans-men": "Slim-fit cotton denim jeans with a tapered leg and five-pocket construction. A clean, versatile cut that works with trainers, boots and everything in between.",
    "straight-raw-denim-jeans-men": "Straight-leg jeans in unwashed raw denim that fade uniquely to the wearer over time. A purist's choice for those who appreciate quality denim.",
    "relaxed-fit-jeans-men": "Relaxed-fit jeans in cotton blend denim with a roomy thigh and straight leg. Comfortable without being shapeless — the smart casual choice.",
    "flannel-pyjama-set-men": "A cotton flannel pyjama set in a classic check with a button-through shirt and elasticated trousers. Warm, cosy and built for proper rest.",
    "jersey-lounge-set-men": "A cotton jersey lounge set with a ribbed crew neck top and drawstring trousers. Comfortable, minimal and the kind of set you wear all weekend.",
    "sleep-shorts-men": "Woven cotton sleep shorts with an elasticated waist and side pockets. Lightweight and cool — the summer alternative to pyjama trousers.",
    "oxford-button-down-shirt-men": "A cotton Oxford button-down shirt in a classic fit with a button-down collar. Smart enough for the office, relaxed enough for the weekend.",
    "linen-shirt-men-summer": "A 100% linen shirt in a relaxed fit that breathes beautifully in the heat. The essential warm-weather shirt that pairs with shorts, chinos and jeans.",
    "flannel-check-shirt-men": "A cotton flannel check shirt that's as good for hiking as it is for weekends in the city. Warm, robust and effortlessly casual.",
    "two-piece-slim-fit-suit-men": "A slim-fit two-piece suit in a wool blend — jacket and trousers cut for a clean, modern silhouette. The foundation of any serious wardrobe.",
    "three-piece-suit-men": "A three-piece suit in 100% wool with a waistcoat, jacket and trousers. The pinnacle of formal dressing — impeccably tailored, undeniably confident.",
    "linen-summer-suit-men": "A relaxed-fit summer suit in 100% linen with a single-breasted jacket and flat-front trousers. Breathable, elegant and made for warm occasions.",
    "merino-wool-v-neck-sweater-men": "A slim-fit merino wool V-neck sweater with a fine gauge knit. Soft, lightweight and the ideal layering piece over shirts or under jackets.",
    "cable-knit-crewneck-men": "A chunky cable knit crewneck in cotton blend. The textured stitch and relaxed fit make it a go-to piece for cooler weekends.",
    "zip-cardigan-men": "A cotton piqué zip cardigan with a clean, sporty finish. Smart enough to wear over a shirt, relaxed enough to pair with jeans.",
    "swim-shorts-board-men": "Polyester board shorts with a quick-dry finish, elasticated waist and side pockets. Built for the water but styled for the beach bar.",
    "swim-trunks-classic-men": "Classic polyamide swim trunks with a mid-length cut and internal mesh liner. Clean styling that works in the pool or at the beach.",
    "rashguard-long-sleeve-men": "A long-sleeve rashguard in polyester spandex with UPF50+ sun protection. Lightweight, stretchy and designed to perform in the water.",
    "classic-cotton-t-shirt-men": "A 100% cotton T-shirt in a classic crew neck with a regular fit. The ultimate blank canvas of the wardrobe — wear it with everything.",
    "polo-shirt-men-slim": "A slim-fit cotton piqué polo shirt with a tipped collar and two-button placket. A clean, sporting classic that dresses up as easily as it dresses down.",
    "graphic-print-t-shirt-men": "A cotton jersey T-shirt with a graphic print on the chest. Casual, characterful and a quick way to inject personality into any outfit.",
    "chino-pants-slim-men": "Slim-fit cotton chino trousers with a flat front and clean crease. Smart enough for the office, versatile enough for everything else.",
    "tailored-trousers-men": "Wool blend tailored trousers with a flat front and tapered leg. The polished counterpart to a smart blazer or a well-chosen roll-neck.",
    "cargo-trousers-men": "Cotton cargo trousers with multiple utility pockets and a relaxed fit. Functional, comfortable and increasingly relevant in contemporary menswear.",
    "boxer-brief-3-pack-men": "A three-pack of cotton stretch boxer briefs in a mid-rise fit. Supportive, breathable and long-lasting — the reliable everyday choice.",
    "athletic-socks-5-pack-men": "A five-pack of cotton blend athletic socks with a cushioned sole and arch support. Built for performance, comfortable all day.",
    "long-thermal-underwear-set-men": "A merino wool thermal base layer set — long-sleeve top and full-length bottoms. Natural temperature regulation keeps you warm without overheating.",

    // ========================================================
    // MEN — SPORTSWEAR
    // ========================================================
    "ski-jacket-insulated-men": "An insulated waterproof ski jacket with sealed seams, powder skirt and multiple pockets. Performance outerwear that's as functional as it is clean in design.",
    "ski-pants-waterproof-men": "Waterproof ski trousers with reinforced knees, ventilation zips and adjustable braces. Engineered to keep you dry and mobile on the mountain.",
    "fleece-mid-layer-ski-men": "A Polartec fleece mid-layer with a full zip and underarm panels. The key component of any technical layering system on the slopes.",
    "sports-gym-bag-men": "A polyester gym bag with a ventilated shoe compartment and multiple pockets. Spacious, tough and designed for the daily commute to the gym.",
    "resistance-bands-set-men": "A set of latex resistance bands in varying resistance levels. The simplest and most effective home training tool you can own.",
    "sport-snapback-cap-men": "A polyester snapback cap with a curved brim and adjustable back strap. Clean, sporty and part of any active wardrobe.",
    "training-shorts-men": "Dri-FIT polyester training shorts with an inner liner and zip side pockets. Lightweight and ventilated for high-intensity workouts.",
    "compression-tights-men": "Nylon blend compression tights that support muscles during and after training. Wear them under shorts or on their own for warm-up and cool-down.",
    "zip-up-track-jacket-men": "A polyester tricot track jacket with a full zip and two zip pockets. The original sporty outerwear piece — worn on the pitch, the court and the street.",
    "running-shoes-react-men": "Mesh upper running shoes with React foam cushioning for a smooth, responsive ride. Built for training runs, comfortable enough for all-day wear.",
    "ultraboost-running-men": "Primeknit running shoes with Boost cushioning for exceptional energy return. Engineered for performance, designed to look good doing it.",
    "training-crossfit-shoe-men": "Synthetic mesh cross-training shoes with a stable, flat sole for lifting and a durable outsole for conditioning work. Built for the variety of CrossFit.",

    // ========================================================
    // MEN — SHOES
    // ========================================================
    "chelsea-boots-leather-men": "Full grain leather Chelsea boots with elastic side panels and a leather sole. Timeless British footwear that belongs in every man's wardrobe.",
    "desert-boot-suede-men": "Suede desert boots with a crepe rubber sole and lace-up front. A casual classic that softens beautifully over time and pairs with everything.",
    "work-boot-heavy-duty-men": "Heavy-duty leather work boots with a Goodyear-welt construction and oil-resistant sole. Built to last a lifetime of hard work.",
    "oxford-derby-shoes-men": "Full grain leather Derby shoes with an open lacing system and leather sole. The most versatile formal shoe in the collection — wear them anywhere.",
    "wingtip-oxford-brogue-men": "Leather Oxford brogues with traditional wingtip detailing and a rubber sole. Heritage craftsmanship that adds character to both smart and casual outfits.",
    "casual-lace-up-sneaker-men": "Leather and mesh lace-up trainers with a cushioned insole and clean, unbranded aesthetic. The everyday sneaker that works with jeans, chinos and everything else.",
    "penny-loafer-leather-men": "Full grain leather penny loafers with a leather sole and classic saddle strap. Effortlessly smart — a footwear staple for the office and beyond.",
    "suede-tassel-loafer-men": "Suede tassel loafers with a leather sole and a relaxed, slightly squared toe. A smarter alternative to a trainer that requires no effort to wear.",
    "driving-moccasin-loafer-men": "Leather driving moccasins with a pebbled rubber sole and hand-stitched upper. Made for driving but comfortable enough to wear all day.",
    "leather-sandal-men": "Leather sandals with an adjustable strap and a cushioned leather footbed. Clean, minimal and comfortable for warm-weather days.",
    "flip-flops-adilette-men": "Classic synthetic slide flip flops with a contoured footbed and durable strap. The original post-sport slide — comfortable, iconic and universally worn.",
    "sport-sandal-velcro-men": "Synthetic sport sandals with Velcro straps and a cushioned sole. Practical, adjustable and built for outdoor activity or casual summer days.",
    "air-force-classic-men": "Leather upper trainers with Air cushioning and a clean, low-profile silhouette. One of the most iconic shoes ever made — and one that's never out of style.",
    "stan-smith-leather-men": "Leather low-top trainers with a perforated three-stripe side panel and a slim profile. A clean, minimal classic that has barely changed since the seventies.",
    "old-skool-trainers-men": "Canvas and suede low-top trainers with a distinctive side stripe and vulcanised sole. Skate heritage meets everyday style in one of the most enduring trainer silhouettes.",

    // ========================================================
    // MEN — ACCESSORIES
    // ========================================================
    "leather-briefcase-men": "A full grain leather briefcase with a structured base and combination lock. The professional carry-all that improves with age.",
    "canvas-backpack-men": "A canvas backpack with a padded laptop sleeve and multiple pockets. Lightweight, functional and smart enough for both commuting and travel.",
    "messenger-bag-leather-men": "A leather messenger bag with an adjustable strap and magnetic flap closure. The alternative to a briefcase that works for both work and weekends.",
    "leather-belt-classic-men": "A full grain leather belt with a classic pin buckle. Simple, quality and the kind of accessory that elevates every pair of trousers.",
    "canvas-belt-woven-men": "A woven canvas belt with a brass buckle and a classic plaid pattern. Casual, preppy and perfect for chinos, shorts or jeans.",
    "reversible-leather-belt-men": "A genuine leather reversible belt in black and brown — two belts in one. The practical solution for a well-dressed wardrobe.",
    "wool-beanie-men": "A wool acrylic beanie in a classic rib knit with a snug, close-fitting profile. Pull it down over your ears when the temperature drops.",
    "snapback-cap-men": "A cotton twill snapback cap with a structured crown and flat brim. Clean, unfussy and a reliable casual accessory.",
    "fedora-felt-hat-men": "A wool felt fedora with a pinched crown and grosgrain band. A confident choice that adds character and a touch of old-school sophistication.",
    "stainless-steel-chain-necklace-men": "A stainless steel chain necklace in a classic link pattern. Understated hardware that adds texture to any neckline.",
    "leather-bracelet-men": "A leather and metal bracelet with a magnetic clasp. Worn alone or stacked, it adds a rugged, crafted detail to the wrist.",
    "signet-ring-men": "A sterling silver signet ring with a flat, engravable face. A heritage piece that carries personal significance and works on any finger.",
    "wool-scarf-men-classic": "A wool blend scarf in a generous size with a striped design and fringed ends. Substantial enough to keep you warm on the coldest commutes.",
    "leather-gloves-men": "Genuine leather gloves with a smooth finish and warm lining. Clean, classic and the mark of a well-considered winter wardrobe.",
    "cashmere-scarf-men": "A 100% cashmere scarf that is softer and warmer than anything else you'll own. An investment in comfort that repays itself every winter.",
    "wayfarer-sunglasses-men": "Acetate wayfarer sunglasses in a classic, slightly oversized frame with UV400 lenses. The most versatile sunglass silhouette ever designed.",
    "aviator-sunglasses-men": "Metal frame aviator sunglasses with teardrop lenses and a slim bridge. A timeless military-derived style that suits almost every face shape.",
    "square-sports-sunglasses-men": "Polycarbonate square sports sunglasses with wraparound coverage and impact-resistant lenses. Built for performance, worn for life.",
    "silk-tie-classic-men": "A 100% silk tie in a classic width with a subtle woven finish. The essential formal accessory — precise, polished and enduring.",
    "wool-knit-tie-men": "A wool knit tie with a squared-off end and a textured, tactile surface. A more relaxed alternative to a silk tie that works beautifully with tweed and flannel.",
    "patterned-silk-tie-men": "A 100% silk tie with a bold geometric or stripe pattern that adds personality to any formal outfit. Let the tie do the talking.",
    "bifold-leather-wallet-men": "A full grain leather bifold wallet with six card slots and a billfold compartment. Slim, organised and built to last.",
    "slim-card-holder-men": "A leather card holder with four dedicated card slots and a minimalist profile. For the man who carries only what he needs.",
    "trifold-wallet-men": "A genuine leather trifold wallet with multiple card slots, a coin pocket and a billfold section. Everything you need in one compact, organised piece.",
}

async function updateDescriptions() {

    let updated = 0
    let notFound = 0

    for (const [slug, description] of Object.entries(descriptions)) {
        const result = await db
            .update(product)
            .set({ description })
            .where(eq(product.slug, slug))
            .returning({ id: product.id })

        if (result.length > 0) {
            updated++
        } else {
            console.warn(`  ⚠ Product not found: ${slug}`)
            notFound++
        }
    }

}

async function main() {
    try {
        await updateDescriptions()
    } catch (error) {
        console.error("❌ Update failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()