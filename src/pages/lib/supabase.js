import Chart from '/node_modules/chart.js/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY || process.env.PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function loadStats() {
    try {
        const { data, error } = await supabase.rpc('get_stats');

        if (error) {
            console.error('Error fetching stats:', error);
            return;
        }

        renderStats(data, Chart);
    } catch (err) {
        console.error('Error:', err);
    }
}

function renderStats(stats) {
    const labels = stats.map((stat) => stat.stat_label);
    const values = stats.map((stat) => stat.stat_value);

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Statistics',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


export async function trackEvent(eventType, additionalData = {}) {
    const userId = getOrCreateUserId();

    if (hasEventBeenTrackedThisSession(eventType)) {
        console.log(`Event "${eventType}" has already been tracked this session.`);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('stats')
            .insert([{
                event_type: eventType,
                additional_data: {
                    user_id: userId,
                    ...additionalData
                },
                timestamp: new Date()
            }]);

        if (!error) {
            markEventAsTrackedThisSession(eventType);
            console.log(`Event "${eventType}" tracked successfully.`);
        } else {
            console.error(`Error tracking event "${eventType}":`, error);
        }
    } catch (err) {
        console.error(`Failed to track event "${eventType}":`, err);
    }
}


function hasEventBeenTrackedThisSession(eventType) {
    const trackedEvents = JSON.parse(sessionStorage.getItem('tracked_events')) || [];
    return trackedEvents.includes(eventType);
}

function markEventAsTrackedThisSession(eventType) {
    const trackedEvents = JSON.parse(sessionStorage.getItem('tracked_events')) || [];
    if (!trackedEvents.includes(eventType)) {
        trackedEvents.push(eventType);
        sessionStorage.setItem('tracked_events', JSON.stringify(trackedEvents));
    }
}





function getOrCreateUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('user_id', userId);
    }
    return userId;
}

function hasEventBeenTracked(eventType) {
    const trackedEvents = JSON.parse(localStorage.getItem('tracked_events')) || [];
    return trackedEvents.includes(eventType);
}

function markEventAsTracked(eventType) {
    const trackedEvents = JSON.parse(localStorage.getItem('tracked_events')) || [];
    if (!trackedEvents.includes(eventType)) {
        trackedEvents.push(eventType);
        localStorage.setItem('tracked_events', JSON.stringify(trackedEvents));
    }
}