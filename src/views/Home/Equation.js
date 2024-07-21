
export function limit(value, min=null, max=null) {
    if (min !== null && value < min)
        return min;
    if (max !== null && value > max)
        return max;
    return value;
}


export function remap(value, low_in, high_in, low_out, high_out) {
    value = limit(value, low_in, high_in);
    
    const normalized = (value - low_in) / (high_in - low_in);
    const remapped = low_out + normalized * (high_out - low_out);

    return remapped;
}

function computeBmiScore(bmi, low_in, high_in, low_out, high_out) {
    const healthy_bmi = 21.7;
    let score = 0
    
    if (bmi > healthy_bmi)
        score = remap(bmi, healthy_bmi, high_in, low_out, high_out)
    else
        score = low_out
        // score = remap(bmi, low_in, healthy_bmi, high_out, low_out)

    return score
}

export function normalizeData(data) {
    const scores = {
        'Agility': remap(data.ampnopro, 32, 42, 0.1, 1),
        'Stairs': remap(data.likelihoodStairs, 1, 5, 0, 1),
        'Ramps': remap(data.likelihoodRamps, 1, 5, 0, 1),
        'Stability': remap(data.age, 30, 65, 0.1, 1),
        'Energy': computeBmiScore(data.bmi, 18.5, 30, 0.1, 1),
        'Gait Quality': 1
    }

    return scores;
}

const weights = {
    cleg: {
        agility: 1.0,
        stairs: 0.5349649920547173,
        ramps: 1.0, 
        stability: 0.9080267559564825, 
        energy: 1.0,
        gc: 0.9245005547074785
    },
    power: {
        agility: 0.88922397209,
        stairs: 0.9386492763613347,
        ramps: 0.7215236324704396, 
        stability: 0.7775919732426539, 
        energy: 0.8500959540855868,
        gc: 1.0
    },
    rheo: {
        agility: 0.93712915547,
        stairs: 1.0,
        ramps: 0.8315310906624779, 
        stability: 1.0, 
        energy: 0.9234430626477406,
        gc: 0.8279907133822905
    }
}

export default function equation(scores) {
    let results = {
        cleg: weights.cleg.agility * scores['Agility'] + 
              weights.cleg.stairs * scores['Stairs'] +
              weights.cleg.ramps * scores['Ramps'] +
              weights.cleg.stability * scores['Stability'] + 
              weights.cleg.energy * scores['Energy'] + 
              weights.cleg.gc * scores['Gait Quality'],

        power: weights.power.agility * scores['Agility'] + 
              weights.power.stairs * scores['Stairs'] +
              weights.power.ramps * scores['Ramps'] +
              weights.power.stability * scores['Stability'] + 
              weights.power.energy * scores['Energy'] + 
              weights.power.gc * scores['Gait Quality'],

        rheo: weights.rheo.agility * scores['Agility'] + 
              weights.rheo.stairs * scores['Stairs'] +
              weights.rheo.ramps * scores['Ramps'] +
              weights.rheo.stability * scores['Stability'] + 
              weights.rheo.energy * scores['Energy'] + 
              weights.rheo.gc * scores['Gait Quality'],
    }

    // normalizing
    const maxscore = Math.max(results.cleg, results.power, results.rheo);
    results = {
        'C-Leg': 100 * results.cleg / maxscore,
        'Power': 100 * results.power / maxscore,
        'Rheo': 100 * results.rheo / maxscore,
    }

    return results
}