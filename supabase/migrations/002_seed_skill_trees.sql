-- Generated from lib/skills/catalog.ts by `npm run seed:sql`. Edit the catalog,
-- not this file. Safe to re-run: existing trees are updated in place by slug, so
-- people's progress rows keep pointing at the same ids.

insert into skill_trees (slug, name, category, summary, sort_order, prerequisites, progressions) values
('pull-up', 'Pull-up Progression', 'pull', 'From a dead hang to the one-arm pull-up. The base for almost every pulling skill.', 0, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Dead Hang",
    "description": "Hang from the bar with straight arms. Builds grip and gets the shoulders used to load.",
    "prerequisite_reps": "30 sec hold",
    "target_type": "hold",
    "target_value": 30,
    "cues": [
      "Grip slightly wider than shoulders",
      "Shoulders active, not shrugged into your ears",
      "Legs together, ribs down"
    ],
    "common_faults": [
      "Fully passive shoulders hanging off the joint",
      "Swinging to stay on the bar"
    ]
  },
  {
    "level": 1,
    "name": "Negative Pull-ups",
    "description": "Jump or step to the top with your chin over the bar, then lower as slowly as you can.",
    "prerequisite_reps": "5 x 5 sec negatives",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Start chin over bar, elbows tight",
      "Take a full 5 seconds to lower",
      "Control the last third, that is where people drop"
    ],
    "common_faults": [
      "Dropping fast once the elbows pass 90 degrees",
      "Not finishing in a full dead hang"
    ]
  },
  {
    "level": 2,
    "name": "Band-Assisted Pull-ups",
    "description": "Full pull-ups with a resistance band taking some of the load. Use the lightest band you can.",
    "prerequisite_reps": "8 reps",
    "target_type": "reps",
    "target_value": 8,
    "cues": [
      "Start every rep from straight arms",
      "Pull the elbows down to your ribs",
      "Chin clearly over the bar"
    ],
    "common_faults": [
      "Using the band to bounce out of the bottom",
      "Half reps that stop at the forehead"
    ]
  },
  {
    "level": 3,
    "name": "Strict Pull-ups",
    "description": "Full range, dead hang to chin over bar, no kipping and no swing.",
    "prerequisite_reps": "8 reps",
    "target_type": "reps",
    "target_value": 8,
    "cues": [
      "Hollow body, legs slightly in front",
      "Lead with the chest, not the chin",
      "Pause at the bottom for a split second"
    ],
    "common_faults": [
      "Kipping or leg drive",
      "Neck craning to get the chin over",
      "Not locking the elbows at the bottom"
    ]
  },
  {
    "level": 4,
    "name": "Weighted Pull-ups",
    "description": "Strict pull-ups with extra load on a dip belt or vest. Builds the raw strength for one-arm work.",
    "prerequisite_reps": "5 reps with +10kg",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Same strict form as bodyweight",
      "Keep the weight still, no swinging",
      "Brace before every rep"
    ],
    "common_faults": [
      "Range of motion shrinking as the weight goes up",
      "Weight swinging and turning reps into kips"
    ]
  },
  {
    "level": 5,
    "name": "Archer Pull-ups",
    "description": "Pull to one hand while the other arm stays nearly straight along the bar. A unilateral bridge to the one-arm.",
    "prerequisite_reps": "5 reps each side",
    "target_type": "reps",
    "target_value": 5,
    "per_side": true,
    "cues": [
      "Wide grip, pull toward the working hand",
      "Assisting arm stays as straight as you can manage",
      "Lower under control to the middle"
    ],
    "common_faults": [
      "Bending the assisting arm so it does half the work",
      "Rushing the descent"
    ]
  },
  {
    "level": 6,
    "name": "One-Arm Pull-up",
    "description": "The full skill. One hand on the bar, dead hang to chin over.",
    "prerequisite_reps": "1 rep each side",
    "target_type": "reps",
    "target_value": 1,
    "per_side": true,
    "cues": [
      "Free hand off the body",
      "Squeeze the whole body tight to stop rotation",
      "Drive the elbow down and in"
    ],
    "common_faults": [
      "Grabbing the wrist or forearm with the other hand",
      "Spinning out halfway up"
    ]
  }
]$json$::jsonb),
('push-up', 'Push-up Progression', 'push', 'Incline push-ups up to the one-arm push-up. Where most pushing strength starts.', 1, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Incline Push-ups",
    "description": "Hands on a bench or bar so the movement is lighter. Lower the incline as you get stronger.",
    "prerequisite_reps": "15 reps",
    "target_type": "reps",
    "target_value": 15,
    "cues": [
      "Straight line from head to heels",
      "Elbows around 45 degrees from the body",
      "Chest touches the edge"
    ],
    "common_faults": [
      "Hips sagging",
      "Elbows flared straight out to the sides"
    ]
  },
  {
    "level": 1,
    "name": "Push-ups",
    "description": "Full push-ups from the floor, chest to the ground and locked out at the top.",
    "prerequisite_reps": "20 reps",
    "target_type": "reps",
    "target_value": 20,
    "cues": [
      "Squeeze glutes and brace the core",
      "Chest to floor every rep",
      "Push the floor away at the top"
    ],
    "common_faults": [
      "Half reps",
      "Head poking forward",
      "Hips leading the chest"
    ]
  },
  {
    "level": 2,
    "name": "Diamond Push-ups",
    "description": "Hands close together under the chest. More triceps and a harder lockout.",
    "prerequisite_reps": "15 reps",
    "target_type": "reps",
    "target_value": 15,
    "cues": [
      "Hands under the sternum",
      "Elbows track back, not out",
      "Same plank as a normal push-up"
    ],
    "common_faults": [
      "Elbows flaring to make it easier",
      "Short range at the bottom"
    ]
  },
  {
    "level": 3,
    "name": "Archer Push-ups",
    "description": "Wide hands, shift your weight to one arm while the other stays straight.",
    "prerequisite_reps": "8 reps each side",
    "target_type": "reps",
    "target_value": 8,
    "per_side": true,
    "cues": [
      "Assisting arm straight",
      "Shoulders stay square to the floor",
      "Chest goes to the working hand"
    ],
    "common_faults": [
      "Bending the assisting arm",
      "Rotating the torso to cheat the range"
    ]
  },
  {
    "level": 4,
    "name": "Incline One-Arm Push-ups",
    "description": "One arm on a bench or bar. Lower the height over time.",
    "prerequisite_reps": "6 reps each side",
    "target_type": "reps",
    "target_value": 6,
    "per_side": true,
    "cues": [
      "Feet wide for a stable base",
      "Fight the rotation with your obliques",
      "Elbow tucked to the side"
    ],
    "common_faults": [
      "Hips twisting open",
      "Partial reps at the bottom"
    ]
  },
  {
    "level": 5,
    "name": "One-Arm Push-up",
    "description": "The full skill from the floor, chest close to the ground and back to lockout.",
    "prerequisite_reps": "5 reps each side",
    "target_type": "reps",
    "target_value": 5,
    "per_side": true,
    "cues": [
      "Feet wider than shoulders",
      "Hand under the shoulder, slightly toward the midline",
      "Stay square, squeeze everything"
    ],
    "common_faults": [
      "Big torso twist",
      "Stopping halfway down"
    ]
  }
]$json$::jsonb),
('dips', 'Dip Progression', 'push', 'Support holds to ring dips. Builds the lockout strength muscle-ups and planche need.', 2, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Support Hold",
    "description": "Hold yourself at the top of the bars with locked elbows.",
    "prerequisite_reps": "30 sec hold",
    "target_type": "hold",
    "target_value": 30,
    "cues": [
      "Elbows locked",
      "Shoulders pressed down, away from the ears",
      "Slight hollow body"
    ],
    "common_faults": [
      "Shoulders shrugged up",
      "Elbows bent to rest"
    ]
  },
  {
    "level": 1,
    "name": "Negative Dips",
    "description": "Start at the top and lower slowly until the shoulders are just below the elbows.",
    "prerequisite_reps": "5 x 5 sec negatives",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Five second descent",
      "Lean slightly forward",
      "Stop when the shoulder passes the elbow"
    ],
    "common_faults": [
      "Dropping too deep with no control",
      "Shoulders rolling forward at the bottom"
    ]
  },
  {
    "level": 2,
    "name": "Parallel Bar Dips",
    "description": "Full dips on bars, shoulder below elbow at the bottom, locked out at the top.",
    "prerequisite_reps": "12 reps",
    "target_type": "reps",
    "target_value": 12,
    "cues": [
      "Shoulders down and back",
      "Full depth",
      "Full lockout"
    ],
    "common_faults": [
      "Shallow reps",
      "Kicking the legs"
    ]
  },
  {
    "level": 3,
    "name": "Weighted Dips",
    "description": "Dips with extra load on a belt or vest.",
    "prerequisite_reps": "6 reps with +15kg",
    "target_type": "reps",
    "target_value": 6,
    "cues": [
      "Same depth as bodyweight dips",
      "Control the weight on the way down",
      "Brace before each rep"
    ],
    "common_faults": [
      "Depth shrinking with more load",
      "Bouncing out of the bottom"
    ]
  },
  {
    "level": 4,
    "name": "Ring Dips",
    "description": "Dips on gymnastic rings, turned out at the top. The rings make every rep unstable.",
    "prerequisite_reps": "10 reps",
    "target_type": "reps",
    "target_value": 10,
    "cues": [
      "Rings close to the body",
      "Turn the rings out at lockout",
      "Slow and controlled"
    ],
    "common_faults": [
      "Rings drifting wide",
      "Skipping the turn out"
    ]
  }
]$json$::jsonb),
('muscle-up', 'Muscle-up Progression', 'pull', 'The bar muscle-up. Explosive pulling, a clean transition and a strong dip to finish.', 3, $json$[
  {
    "slug": "pull-up",
    "level": 3
  },
  {
    "slug": "dips",
    "level": 2
  }
]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Chest-to-Bar Pull-ups",
    "description": "Pull-ups where the chest touches the bar, not just the chin clearing it.",
    "prerequisite_reps": "5 reps",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Pull the bar to your collarbone",
      "Lean back slightly at the top",
      "Elbows drive behind you"
    ],
    "common_faults": [
      "Stopping at chin height",
      "Craning the neck forward"
    ]
  },
  {
    "level": 1,
    "name": "Explosive Pull-ups",
    "description": "Pull as high and fast as you can, aiming for the bar to reach your lower chest or waist.",
    "prerequisite_reps": "5 reps to the waist",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Start from a dead hang",
      "Pull the bar toward your hips, not your face",
      "Max speed on every rep"
    ],
    "common_faults": [
      "Pulling straight up instead of up and back",
      "Slow grinding reps"
    ]
  },
  {
    "level": 2,
    "name": "Straight Bar Dips",
    "description": "Dips on top of a single straight bar. This is the second half of the muscle-up.",
    "prerequisite_reps": "8 reps",
    "target_type": "reps",
    "target_value": 8,
    "cues": [
      "Lean over the bar",
      "Chest down to the bar",
      "Lock out fully"
    ],
    "common_faults": [
      "Staying too upright and slipping back",
      "Shallow reps"
    ]
  },
  {
    "level": 3,
    "name": "Band-Assisted Muscle-ups",
    "description": "Full muscle-ups with a band helping through the transition.",
    "prerequisite_reps": "5 reps",
    "target_type": "reps",
    "target_value": 5,
    "cues": [
      "Slight swing back then pull hard",
      "Wrists roll over the bar quickly",
      "Punch the chest over"
    ],
    "common_faults": [
      "One arm going over before the other",
      "Letting the band do the transition"
    ]
  },
  {
    "level": 4,
    "name": "Negative Muscle-ups",
    "description": "Start on top of the bar and lower slowly through the transition to a hang.",
    "prerequisite_reps": "3 reps",
    "target_type": "reps",
    "target_value": 3,
    "cues": [
      "Stay close to the bar",
      "Slow through the transition",
      "Feel the wrist and elbow positions"
    ],
    "common_faults": [
      "Dropping through the transition",
      "Hips pushing away from the bar"
    ]
  },
  {
    "level": 5,
    "name": "Strict Bar Muscle-up",
    "description": "The full skill. Pull, transition and dip out with minimal swing.",
    "prerequisite_reps": "3 reps",
    "target_type": "reps",
    "target_value": 3,
    "cues": [
      "False grip or high grip helps",
      "Pull to the hips",
      "Both arms over at the same time"
    ],
    "common_faults": [
      "Chicken wing, one elbow over first",
      "Huge kip to make up for weak pulling"
    ]
  }
]$json$::jsonb),
('front-lever', 'Front Lever', 'pull', 'Hold your body horizontal under the bar, face up. Straight arm pulling strength and a strong core.', 4, $json$[
  {
    "slug": "pull-up",
    "level": 3
  }
]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Hanging Scapular Pulls",
    "description": "From a dead hang, pull the shoulder blades down and back without bending the elbows.",
    "prerequisite_reps": "10 reps",
    "target_type": "reps",
    "target_value": 10,
    "cues": [
      "Arms stay straight",
      "Pull the shoulders away from the ears",
      "Pause at the top"
    ],
    "common_faults": [
      "Bending the elbows",
      "Rushing reps with no pause"
    ]
  },
  {
    "level": 1,
    "name": "Tuck Front Lever",
    "description": "Knees pulled tight to the chest, back horizontal under the bar.",
    "prerequisite_reps": "15 sec hold",
    "target_type": "hold",
    "target_value": 15,
    "cues": [
      "Straight arms",
      "Push the bar down toward your hips",
      "Back flat, hips level with shoulders"
    ],
    "common_faults": [
      "Bent arms",
      "Hips sagging below the shoulders"
    ]
  },
  {
    "level": 2,
    "name": "Advanced Tuck Front Lever",
    "description": "Back flat and the knees pushed out so the thighs are at 90 degrees to the torso.",
    "prerequisite_reps": "10 sec hold",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Flat back, no rounding",
      "Knees away from the chest",
      "Depress the shoulders hard"
    ],
    "common_faults": [
      "Rounding the back to make it easier",
      "Body tilting upward"
    ]
  },
  {
    "level": 3,
    "name": "One-Leg Front Lever",
    "description": "One leg extended straight, the other tucked.",
    "prerequisite_reps": "8 sec hold each side",
    "target_type": "hold",
    "target_value": 8,
    "per_side": true,
    "cues": [
      "Extended leg in line with the body",
      "Hips stay level",
      "Squeeze the glutes"
    ],
    "common_faults": [
      "Hips piking up",
      "Extended leg dropping below the body line"
    ]
  },
  {
    "level": 4,
    "name": "Straddle Front Lever",
    "description": "Both legs straight and split wide to shorten the lever.",
    "prerequisite_reps": "5 sec hold",
    "target_type": "hold",
    "target_value": 5,
    "cues": [
      "Legs wide and straight",
      "Posterior pelvic tilt",
      "Body parallel to the floor"
    ],
    "common_faults": [
      "Arched lower back",
      "Hips below the line"
    ]
  },
  {
    "level": 5,
    "name": "Full Front Lever",
    "description": "The full skill. Legs together, body straight and horizontal.",
    "prerequisite_reps": "3 sec hold",
    "target_type": "hold",
    "target_value": 3,
    "cues": [
      "Legs together, toes pointed",
      "Straight arms, depressed shoulders",
      "Squeeze glutes and abs"
    ],
    "common_faults": [
      "Bent elbows",
      "Hips piked or dropped"
    ]
  }
]$json$::jsonb),
('back-lever', 'Back Lever', 'pull', 'Hold your body horizontal under the bar or rings, face down. Shoulder flexibility and straight arm strength.', 5, $json$[
  {
    "slug": "pull-up",
    "level": 2
  }
]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "German Hang",
    "description": "Skin the cat and hang with the shoulders in deep extension. Builds the mobility you need.",
    "prerequisite_reps": "20 sec hold",
    "target_type": "hold",
    "target_value": 20,
    "cues": [
      "Go in slowly",
      "Keep the arms straight",
      "Breathe and relax into the stretch"
    ],
    "common_faults": [
      "Dropping in fast",
      "Bent elbows taking the stretch off"
    ]
  },
  {
    "level": 1,
    "name": "Tuck Back Lever",
    "description": "Knees tucked, back horizontal, face down.",
    "prerequisite_reps": "15 sec hold",
    "target_type": "hold",
    "target_value": 15,
    "cues": [
      "Straight arms",
      "Back level with the floor",
      "Hands slightly wider than shoulders"
    ],
    "common_faults": [
      "Bent arms",
      "Hips too high"
    ]
  },
  {
    "level": 2,
    "name": "Advanced Tuck Back Lever",
    "description": "Back flat and the knees pushed away from the chest.",
    "prerequisite_reps": "10 sec hold",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Flat back",
      "Thighs at 90 degrees to the torso",
      "Push down through straight arms"
    ],
    "common_faults": [
      "Rounding the back",
      "Piking at the hips"
    ]
  },
  {
    "level": 3,
    "name": "Straddle Back Lever",
    "description": "Legs straight and split wide.",
    "prerequisite_reps": "8 sec hold",
    "target_type": "hold",
    "target_value": 8,
    "cues": [
      "Legs wide and locked",
      "Hips extended, no pike",
      "Body horizontal"
    ],
    "common_faults": [
      "Arched lower back",
      "Legs dropping"
    ]
  },
  {
    "level": 4,
    "name": "Full Back Lever",
    "description": "The full skill. Legs together, body straight and parallel to the ground.",
    "prerequisite_reps": "5 sec hold",
    "target_type": "hold",
    "target_value": 5,
    "cues": [
      "Legs together",
      "Glutes squeezed, hips extended",
      "Straight arms"
    ],
    "common_faults": [
      "Pike at the hips",
      "Excessive arch in the lower back"
    ]
  }
]$json$::jsonb),
('planche', 'Planche Progression', 'push', 'Balance the whole body horizontal on straight arms. One of the hardest skills in the sport.', 6, $json$[
  {
    "slug": "push-up",
    "level": 1
  },
  {
    "slug": "dips",
    "level": 2
  }
]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Planche Lean",
    "description": "Push-up position with the shoulders leaning well past the hands. Builds wrist and shoulder tolerance.",
    "prerequisite_reps": "30 sec",
    "target_type": "hold",
    "target_value": 30,
    "cues": [
      "Fingers turned out a little",
      "Protract the shoulders, round the upper back",
      "Lean until the shoulders are past the wrists"
    ],
    "common_faults": [
      "Shoulders retracted and sagging between the blades",
      "Bent elbows",
      "Not leaning far enough"
    ]
  },
  {
    "level": 1,
    "name": "Tuck Planche",
    "description": "Knees tucked to chest, feet off the ground, balanced on straight arms.",
    "prerequisite_reps": "10 sec hold",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Straight arms",
      "Protracted, depressed shoulders",
      "Hips level with the shoulders"
    ],
    "common_faults": [
      "Bent arms (that is a crow pose, not a planche)",
      "Hips too low"
    ]
  },
  {
    "level": 2,
    "name": "Advanced Tuck Planche",
    "description": "Hips higher and back flat, knees pushed away from the chest. Much more lean.",
    "prerequisite_reps": "10 sec hold",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Flat back",
      "Lean further forward",
      "Keep the protraction"
    ],
    "common_faults": [
      "Rounded back taking the load off",
      "Shoulders sliding back"
    ]
  },
  {
    "level": 3,
    "name": "Straddle Planche",
    "description": "Legs straight and split wide, body horizontal.",
    "prerequisite_reps": "5 sec hold",
    "target_type": "hold",
    "target_value": 5,
    "cues": [
      "Posterior pelvic tilt",
      "Legs locked and wide",
      "Hips at shoulder height"
    ],
    "common_faults": [
      "Arched lower back",
      "Bent elbows",
      "Legs below the hips"
    ]
  },
  {
    "level": 4,
    "name": "Full Planche",
    "description": "Legs together, fully extended, body parallel to the floor.",
    "prerequisite_reps": "3 sec hold",
    "target_type": "hold",
    "target_value": 3,
    "cues": [
      "Legs together, toes pointed",
      "Huge lean and protraction",
      "Squeeze everything"
    ],
    "common_faults": [
      "Piked or dropped hips",
      "Bent arms"
    ]
  }
]$json$::jsonb),
('handstand', 'Handstand', 'balance', 'From the wall to a freestanding minute. Balance, line and wrist strength.', 7, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Pike Hold on Box",
    "description": "Feet on a box, hips stacked over the shoulders. Gets used to being upside down.",
    "prerequisite_reps": "30 sec hold",
    "target_type": "hold",
    "target_value": 30,
    "cues": [
      "Hips over the shoulders",
      "Push tall through the shoulders",
      "Look between the hands"
    ],
    "common_faults": [
      "Shoulders not open, weight on the head",
      "Bent arms"
    ]
  },
  {
    "level": 1,
    "name": "Chest-to-Wall Handstand",
    "description": "Walk your feet up the wall, belly facing it, and hold a straight line.",
    "prerequisite_reps": "45 sec hold",
    "target_type": "hold",
    "target_value": 45,
    "cues": [
      "Hands close to the wall",
      "Push the floor away",
      "Ribs in, glutes squeezed"
    ],
    "common_faults": [
      "Banana back",
      "Shoulders closed with the head pushed through"
    ]
  },
  {
    "level": 2,
    "name": "Wall Toe Pulls",
    "description": "In a chest-to-wall handstand, pull the toes off the wall and balance on your fingers.",
    "prerequisite_reps": "10 sec off the wall",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Use the fingertips to stop falling over",
      "Small corrections only",
      "Keep the line"
    ],
    "common_faults": [
      "Bending the elbows to correct",
      "Arching to stay up"
    ]
  },
  {
    "level": 3,
    "name": "Freestanding Handstand",
    "description": "Kick up away from the wall and hold. Learn to bail with a cartwheel first.",
    "prerequisite_reps": "10 sec hold",
    "target_type": "hold",
    "target_value": 10,
    "cues": [
      "Consistent kick-up",
      "Fingers grip the floor",
      "Stack wrists, shoulders, hips and ankles"
    ],
    "common_faults": [
      "Overkicking",
      "Walking on the hands to stay up"
    ]
  },
  {
    "level": 4,
    "name": "Handstand 30 Seconds",
    "description": "A steady freestanding hold with very little hand movement.",
    "prerequisite_reps": "30 sec hold",
    "target_type": "hold",
    "target_value": 30,
    "cues": [
      "Breathe steadily",
      "Hollow, not banana",
      "Tight legs and pointed toes"
    ],
    "common_faults": [
      "Holding the breath",
      "Gradual arch as the hold goes on"
    ]
  },
  {
    "level": 5,
    "name": "Handstand 60 Seconds",
    "description": "The full skill. A clean straight line for a full minute.",
    "prerequisite_reps": "60 sec hold",
    "target_type": "hold",
    "target_value": 60,
    "cues": [
      "Shoulders fully open",
      "Minimal corrections",
      "Same line from start to finish"
    ],
    "common_faults": [
      "Elbows softening when tired",
      "Head pushing out of line"
    ]
  }
]$json$::jsonb),
('l-sit', 'L-sit to V-sit', 'core', 'Compression and straight arm support. Shows up in nearly every other skill.', 8, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Foot-Supported L-sit",
    "description": "Hands on parallettes or the floor, heels lightly on the ground, hips lifted.",
    "prerequisite_reps": "20 sec hold",
    "target_type": "hold",
    "target_value": 20,
    "cues": [
      "Arms locked",
      "Shoulders pushed down",
      "Hips off the floor"
    ],
    "common_faults": [
      "Shoulders shrugged up",
      "Bent arms"
    ]
  },
  {
    "level": 1,
    "name": "Tuck L-sit",
    "description": "Knees tucked to the chest, everything off the ground.",
    "prerequisite_reps": "15 sec hold",
    "target_type": "hold",
    "target_value": 15,
    "cues": [
      "Push tall through the shoulders",
      "Knees high",
      "Lean forward a touch"
    ],
    "common_faults": [
      "Shoulders collapsing",
      "Feet dragging"
    ]
  },
  {
    "level": 2,
    "name": "One-Leg L-sit",
    "description": "One leg straight out in front, the other tucked.",
    "prerequisite_reps": "15 sec hold each side",
    "target_type": "hold",
    "target_value": 15,
    "per_side": true,
    "cues": [
      "Extended leg locked at the knee",
      "Toes pointed",
      "Hips stay level"
    ],
    "common_faults": [
      "Bent knee on the straight leg",
      "Leg drooping toward the floor"
    ]
  },
  {
    "level": 3,
    "name": "Full L-sit",
    "description": "Both legs straight and together, parallel to the ground.",
    "prerequisite_reps": "20 sec hold",
    "target_type": "hold",
    "target_value": 20,
    "cues": [
      "Legs at or above hip height",
      "Quads squeezed, knees locked",
      "Shoulders depressed"
    ],
    "common_faults": [
      "Bent knees",
      "Legs dropping below horizontal"
    ]
  },
  {
    "level": 4,
    "name": "V-sit",
    "description": "Legs raised well above horizontal toward the face. Needs serious compression.",
    "prerequisite_reps": "5 sec hold",
    "target_type": "hold",
    "target_value": 5,
    "cues": [
      "Lean the shoulders back",
      "Compress hard, pull the legs to you",
      "Straight arms"
    ],
    "common_faults": [
      "Bent arms",
      "Rounded back with legs barely above an L"
    ]
  }
]$json$::jsonb),
('pistol-squat', 'Pistol Squat', 'legs', 'Single leg strength, balance and mobility. The calisthenics answer to heavy squats.', 9, $json$[]$json$::jsonb, $json$[
  {
    "level": 0,
    "name": "Bodyweight Squats",
    "description": "Full depth squats with heels down and a tall chest.",
    "prerequisite_reps": "25 reps",
    "target_type": "reps",
    "target_value": 25,
    "cues": [
      "Heels stay down",
      "Knees track over the toes",
      "Hips below the knees"
    ],
    "common_faults": [
      "Heels lifting",
      "Knees caving in"
    ]
  },
  {
    "level": 1,
    "name": "Bulgarian Split Squats",
    "description": "Rear foot up on a bench, lower the back knee toward the floor.",
    "prerequisite_reps": "12 reps each side",
    "target_type": "reps",
    "target_value": 12,
    "per_side": true,
    "cues": [
      "Most of the weight on the front leg",
      "Torso tall",
      "Front knee over the toes"
    ],
    "common_faults": [
      "Pushing off the back foot",
      "Front knee caving in"
    ]
  },
  {
    "level": 2,
    "name": "Box Pistols",
    "description": "Single leg squat down to a box or bench and stand back up.",
    "prerequisite_reps": "8 reps each side",
    "target_type": "reps",
    "target_value": 8,
    "per_side": true,
    "cues": [
      "Reach the arms forward to balance",
      "Sit back under control",
      "Lower the box over time"
    ],
    "common_faults": [
      "Plopping onto the box",
      "Rocking to stand up"
    ]
  },
  {
    "level": 3,
    "name": "Assisted Pistols",
    "description": "Full depth pistol while holding a post, ring or door frame lightly.",
    "prerequisite_reps": "8 reps each side",
    "target_type": "reps",
    "target_value": 8,
    "per_side": true,
    "cues": [
      "Use as little help as you can",
      "Free leg straight and off the floor",
      "Full depth"
    ],
    "common_faults": [
      "Pulling yourself up with the arms",
      "Heel lifting at the bottom"
    ]
  },
  {
    "level": 4,
    "name": "Pistol Squat",
    "description": "Full depth single leg squat, free leg out in front, no help.",
    "prerequisite_reps": "5 reps each side",
    "target_type": "reps",
    "target_value": 5,
    "per_side": true,
    "cues": [
      "Heel down the whole time",
      "Arms forward as a counterweight",
      "Stand up without bouncing"
    ],
    "common_faults": [
      "Knee collapsing inward",
      "Free foot touching the floor"
    ]
  },
  {
    "level": 5,
    "name": "Weighted Pistol",
    "description": "Pistol squats holding a kettlebell or plate in front.",
    "prerequisite_reps": "5 reps each side with +10kg",
    "target_type": "reps",
    "target_value": 5,
    "per_side": true,
    "cues": [
      "Hold the weight out front as a counterbalance",
      "Same depth as bodyweight",
      "Control the descent"
    ],
    "common_faults": [
      "Losing depth",
      "Rounding the back under load"
    ]
  }
]$json$::jsonb)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  summary = excluded.summary,
  sort_order = excluded.sort_order,
  prerequisites = excluded.prerequisites,
  progressions = excluded.progressions;
