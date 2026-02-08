// ==========================================================================
// Regex Tester Pro — Terms of Service & EULA Generator
// MD 23 Agent 3: ToS content, EULA, age restrictions, limitation of liability
// ==========================================================================

const LegalDocuments = (() => {
    'use strict';

    const COMPANY = {
        name: 'Zovo',
        website: 'https://zovo.one',
        contact: 'legal@zovo.one',
        extensionName: 'Regex Tester Pro'
    };

    // ── Terms of Service ──
    function generateTermsOfService() {
        const date = new Date().toISOString().split('T')[0];

        return {
            title: 'Terms of Service',
            lastUpdated: date,
            sections: [
                {
                    heading: 'Agreement to Terms',
                    content: `By installing, accessing, or using the ${COMPANY.extensionName} browser extension ("Extension"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not install or use the Extension. These Terms constitute a legally binding agreement between you and ${COMPANY.name} ("Company," "we," "us," or "our").`
                },
                {
                    heading: 'Description of Service',
                    content: `${COMPANY.extensionName} is a browser extension that provides real-time regular expression testing, pattern matching, capture group extraction, find and replace, and pattern history management. The Extension may include free and premium ("Pro") features.`
                },
                {
                    heading: 'Eligibility',
                    content: 'You must be at least 13 years old to use this Extension. If you are under 18, you represent that you have your parent or guardian\'s permission. By using the Extension, you represent and warrant that you meet these eligibility requirements.'
                },
                {
                    heading: 'User Accounts and Subscriptions',
                    content: 'Some features require a Pro subscription. Subscription terms, pricing, and billing are managed through our payment processor. You may cancel your subscription at any time. Refunds are handled in accordance with the Chrome Web Store refund policy and our refund policy.'
                },
                {
                    heading: 'Acceptable Use',
                    content: `You agree not to: (a) use the Extension for any unlawful purpose; (b) attempt to reverse engineer, decompile, or disassemble the Extension; (c) interfere with or disrupt the Extension's services; (d) use the Extension to process or test patterns against data you do not have the right to use; (e) circumvent any access controls or usage limitations.`
                },
                {
                    heading: 'Intellectual Property',
                    content: `The Extension and its original content, features, and functionality are owned by ${COMPANY.name} and are protected by international copyright, trademark, and other intellectual property laws. User-generated regex patterns remain the property of the user.`
                },
                {
                    heading: 'Privacy',
                    content: `Your use of the Extension is also governed by our Privacy Policy, available at ${COMPANY.website}/privacy. By using the Extension, you consent to the practices described in the Privacy Policy.`
                },
                {
                    heading: 'Disclaimer of Warranties',
                    content: 'THE EXTENSION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE EXTENSION WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.'
                },
                {
                    heading: 'Limitation of Liability',
                    content: `IN NO EVENT SHALL ${COMPANY.name.toUpperCase()} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE EXTENSION. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE EXTENSION IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.`
                },
                {
                    heading: 'Indemnification',
                    content: `You agree to indemnify and hold harmless ${COMPANY.name}, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Extension or violation of these Terms.`
                },
                {
                    heading: 'Modifications to Terms',
                    content: 'We reserve the right to modify these Terms at any time. We will notify users of material changes through the Extension or by other means. Your continued use after changes constitutes acceptance of the modified Terms.'
                },
                {
                    heading: 'Termination',
                    content: 'We may terminate or suspend your access to the Extension at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.'
                },
                {
                    heading: 'Contact',
                    content: `For questions about these Terms, contact us at ${COMPANY.contact}.`
                }
            ]
        };
    }

    // ── End User License Agreement (EULA) ──
    function generateEULA() {
        const date = new Date().toISOString().split('T')[0];

        return {
            title: 'End User License Agreement',
            lastUpdated: date,
            sections: [
                {
                    heading: 'License Grant',
                    content: `${COMPANY.name} grants you a limited, non-exclusive, non-transferable, revocable license to use the ${COMPANY.extensionName} Extension for personal or internal business purposes, subject to these terms.`
                },
                {
                    heading: 'License Restrictions',
                    content: 'You may not: (a) copy, modify, or distribute the Extension; (b) reverse engineer, decompile, or disassemble the Extension; (c) rent, lease, lend, sell, or sublicense the Extension; (d) use the Extension to develop a competing product; (e) remove any proprietary notices or labels.'
                },
                {
                    heading: 'Pro License',
                    content: 'A Pro license provides access to premium features for the licensed user only. Team licenses are available for organizations. License keys are non-transferable and tied to the purchasing account.'
                },
                {
                    heading: 'Updates',
                    content: `${COMPANY.name} may provide updates, patches, and new versions of the Extension. Such updates may be automatically installed. Continued use after updates constitutes acceptance of any modified terms.`
                },
                {
                    heading: 'Data Collection',
                    content: 'The Extension processes regex patterns and test strings locally on your device. We do not transmit your regex patterns or test data to our servers. See our Privacy Policy for details on data we do collect.'
                },
                {
                    heading: 'Open Source Components',
                    content: 'The Extension may incorporate open source software components. Each component is subject to its own license terms, which can be found in the Extension\'s source attribution file.'
                },
                {
                    heading: 'Termination',
                    content: 'This license is effective until terminated. It terminates automatically if you fail to comply with any term. Upon termination, you must uninstall the Extension and destroy all copies.'
                },
                {
                    heading: 'Governing Law',
                    content: 'This EULA shall be governed by the laws of the jurisdiction in which the Company is incorporated, without regard to conflict of law provisions.'
                }
            ]
        };
    }

    // ── Render Legal Document as HTML ──
    function renderAsHTML(document) {
        const sectionsHTML = document.sections.map((section, i) => `
      <section style="margin-bottom:1.5rem">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:0.5rem;color:var(--text-primary,#e0e0e0)">${i + 1}. ${section.heading}</h3>
        <p style="font-size:0.875rem;line-height:1.6;color:var(--text-secondary,#aaa)">${section.content}</p>
      </section>
    `).join('');

        return `
      <div style="max-width:600px;padding:1.5rem">
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:0.25rem;color:var(--text-primary,#e0e0e0)">${document.title}</h2>
        <p style="font-size:0.75rem;color:var(--text-secondary,#888);margin-bottom:1.5rem">Last Updated: ${document.lastUpdated}</p>
        ${sectionsHTML}
      </div>
    `;
    }

    // ── Render Legal Document as Markdown ──
    function renderAsMarkdown(document) {
        const lines = [`# ${document.title}`, `**Last Updated: ${document.lastUpdated}**`, ''];
        document.sections.forEach((section, i) => {
            lines.push(`## ${i + 1}. ${section.heading}`, '', section.content, '');
        });
        return lines.join('\n');
    }

    return {
        COMPANY,
        generateTermsOfService,
        generateEULA,
        renderAsHTML,
        renderAsMarkdown
    };
})();
